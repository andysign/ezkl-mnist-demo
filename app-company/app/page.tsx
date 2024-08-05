// import styles from "./page.module.scss";
// import ImageUploader from "./_components/image-uploader/image-uploader";
// import { MNISTDraw } from "@/components/mnist-draw/MNISTDraw";
import MNISTDashboard from "@/components/mnist-dashboard/MNISTDashboard";

export default function Home() {
  return (
    <>
      <section className="bg-blue-950 sm:p-2 md:p-4 lg:p-8">

        <MNISTDashboard />

      </section>

    </>
  );
}
