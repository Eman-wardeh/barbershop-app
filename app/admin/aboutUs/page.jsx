"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function AboutUsPage() {
    const router = useRouter();
  const [aboutUs, setAboutUs] = useState("");

  const onSave = async () => {
    await axios.post("/api/admin/aboutUs", {
      content: aboutUs,
    });
    router.push("/aboutUs");
  };

  return (
    <div className="main-div1">
        <h1>Add About Us</h1>
      <textarea
        rows={20}
        cols={50}
        value={aboutUs}
        onChange={(e) => setAboutUs(e.target.value)}
      />

      <button onClick={onSave}>Save</button>
    </div>
  );
}