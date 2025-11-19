"use client";

import { Suspense } from "react";
import UploadSlipPageContent from "./UploadSlipPageContent";

export default function UploadSlipPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <UploadSlipPageContent />
    </Suspense>
  );
}
