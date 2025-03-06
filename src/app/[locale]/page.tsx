"use client"
import {useTranslations} from 'next-intl';
import {Link} from '@/i18n/navigation';
 
export default function HomePage() {
  const t = useTranslations('HomePage');
  return (
    <div className='h-fit flex flex-col items-center '>
      <div className='h-[70vh] bg-blue-500 rounded-4xl w-full'>
        <h1 className='bg-white text-6xl font-bold m-2'>{t('title')}</h1>
        <div className='bg-amber-200 rounded-3xl p-2 w-fit'>
          <Link className='text-5xl ' href="/detect">{t('detect')}</Link>
        </div>
        
      </div>
    </div>
  );
}

// #f8fe23 green

// #7546ff purple

// #131313 black

// #f9f5ec near to white