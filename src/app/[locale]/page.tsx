"use client"
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className='h-fit flex flex-col items-center '>
      <div className='h-[70vh]  border-x border-gray-300 w-full'>
        <h1 className='bg-white text-2xl m-2'>{t('title')}</h1>
        <Link href="/about">{t('about')}</Link>
      </div>
      {/* black rounded section  */}
      <div className=' rounded-4xl bg-black h-[120vh] w-full'>
        

      </div>
     
    </div>
  );
}

// #f8fe23 green

// #7546ff purple

// #131313 black

// #f9f5ec near to white