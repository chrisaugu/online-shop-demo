'use client'
import { useRouter } from "next/navigation";
import { useEffect } from "react";

// @next-codemod-ignore Cache Components adoption: this segment temporarily allows blocking.
// Remove this opt-out after verifying the segment passes validation without it.
// See: https://nextjs.org/docs/app/guides/migrating-to-cache-components
// export const instant = false;

export default function MyClientComponent({ }) {
    const router = useRouter();

    useEffect(() => {
        const handleMessage = async (message: MessageEvent<any>) => {
            if (
                // Filters events emitted through the postMessage() API
                message.origin === process.env.NEXT_PUBLIC_API_URL &&
                message.data.type === "strapiUpdate"
            ) { // Recommended way to refresh with Next.js
                router.refresh();
            }
        };

        // Add the event listener
        window.addEventListener("message", handleMessage);

        // Cleanup the event listener on unmount
        return () => {
            window.removeEventListener("message", handleMessage);
        };
    }, [router]);
}