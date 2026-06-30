import { NextResponse } from "next/server";
import { connectToDb } from "@/dbConfig/dbConfig";
import WorkingHours from "@/models/WorkingHours";
import BarberTimeOff from "@/models/BarberTimeOff";
import Appointment from "@/models/Appointment";

connectToDb();

const SLOT_DURATION = 30;

// helpers
const toMinutes = (time) => {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
};

const toTimeString = (minutes) => {
  const h = String(Math.floor(minutes / 60)).padStart(2, "0");
  const m = String(minutes % 60).padStart(2, "0");
  return `${h}:${m}`;
};

const generateSlots = (start, end, duration) => {
  const slots = [];

  for (let t = start; t + duration <= end; t += duration) {
    slots.push({
      start: t,
      end: t + duration,
    });
  }

  return slots;
};

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const barberId = searchParams.get("barberId");
    const date = searchParams.get("date");
    const duration = parseInt(searchParams.get("duration")) || SLOT_DURATION;
    console.log("Received params:", { barberId, date, duration });
    //query parameters in URLs are always strings.
    // parseInt is to convert a string to a number, if duration is not provided, it will default to SLOT_DURATION
    if (!barberId || !date) {
      return NextResponse.json(
        { message: "Missing parameters" },
        { status: 400 }
      );
    }

    const appointmentDate = new Date(date);

    if (isNaN(appointmentDate.getTime())) {
        return NextResponse.json(
        { message: "Invalid date" },
        { status: 400 }
        );
    }

    const day = appointmentDate.getDay();

    // 1. TIME OFF CHECK
    const timeOff = await BarberTimeOff.findOne({
        barber: barberId,
        start_date_time: { $lte: appointmentDate },
        end_date_time: { $gte: appointmentDate },
    });
    console.log("TimeOff:", timeOff);
    if (timeOff) {
        return NextResponse.json({message: "Barber is in timeoff", slots: [] }, {status: 200});
    }

    // 2. WORKING HOURS
    const workingHours = await WorkingHours.findOne({
        barber: barberId,
        dayOfWeek: day,
    });
    console.log("WorkingHours:", workingHours);
    if (!workingHours) {
      return NextResponse.json({ slots: [] });
    }

    const start = toMinutes(workingHours.startTime);
    const end = toMinutes(workingHours.endTime);

    // 3. GENERATE RAW SLOTS
    let slots = generateSlots(start, end, duration);

    // 4. GET APPOINTMENTS FOR THAT DAY
    const dayStart = new Date(appointmentDate);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(appointmentDate);
    dayEnd.setHours(23, 59, 59, 999);

    const appointments = await Appointment.find({
        barber: barberId,
        appointmentDate: {
            $gte: dayStart,
            $lte: dayEnd,
        },
        status: { $ne: "cancelled" },
    });

    // 5. REMOVE CONFLICTS
    slots = slots.filter((slot) => {
      return !appointments.some((app) => {
        return slot.start < app.endTime && slot.end > app.startTime;
      });
    });

    // 6. FORMAT RESPONSE
    return NextResponse.json({
      slots: slots.map((s) => ({
        start: toTimeString(s.start),
        end: toTimeString(s.end),
      })),
    });
  } catch (error) {
    return NextResponse.json(
      { message: "Server error" },
      { status: 500 }
    );
  }
}