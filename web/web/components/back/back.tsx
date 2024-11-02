import Chevron from '@/assets/svg/chevron';
import Link from 'next/link';

export default function Back({ url }: { url: string }) {
  return (
    <div className="mt-2 -ml-4 -mt-12 lg:-ml-0 flex">
      <Chevron />
      <Link href={url} className="hover:text-indigo-400">
        Back
      </Link>
    </div>
  );
}
