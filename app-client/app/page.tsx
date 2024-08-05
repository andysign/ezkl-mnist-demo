import styles from "./page.module.scss";
// import ImageUploader from "./_components/image-uploader/image-uploader";
import { MNISTDraw } from "@/components/mnist-draw/MNISTDraw";

export default function Home() {
  return (
    <>
      <section className="bg-gray-800 sm:p-2 md:p-4 lg:p-8">

        <MNISTDraw />

      </section>

      {/* ToRemove */}
      <div className={styles.container}>
        {/* <MNISTDraw /> */}
      </div>
      {/* ToRemoveEnd */}

    </>
  );
}
