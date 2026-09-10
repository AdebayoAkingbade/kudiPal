"use client";

import { usePathname } from "next/navigation";
import { Stepper } from "@/components/onboarding/stepper";

export function OnboardingLayoutClient({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    let currentStep = 1;
    if (pathname.includes("account-setup")) currentStep = 1;
    if (pathname.includes("business-info")) currentStep = 2;
    if (pathname.includes("upload-data")) currentStep = 3;

    return (
        <>
            <div className="py-6 md:py-10">
                <Stepper currentStep={currentStep} />
            </div>
            <div className="flex-1 container mx-auto px-4 pb-20">
                {children}
            </div>
        </>
    );
}
