"use client";
import Image from "next/image";

export default function Gallery(){
    return(
        <div className="gallery">
            <div>
                <Image height={300} width={300} src="/image/g1.png" alt="galley img" />
                <span>Look Sharp. Feel Confident.</span>
            </div>
            <div>
                <span>Consistent Quality</span>
                <Image height={300} width={300} src="/image/g2.png" alt="galley img" />

            </div>
            <div>
                <Image height={300} width={300} src="/image/g3.png" alt="galley img" />
                <span>Feel Your Best</span>
            </div>
            <div> 
                <span>Commitment to Excellence</span>
                <Image height={300} width={300} src="/image/g4.png" alt="galley img" />

            </div>
            <div>
                <Image height={300} width={300} src="/image/g5.png" alt="galley img" />
                <span>Kid-Approved Styles</span>
            </div>
                        
        </div>
    )
}