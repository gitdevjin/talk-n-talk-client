import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      Home Page
      <Link href={"/client/dm/friend"}>
        <div>get started</div>
      </Link>
    </div>
  );
}
