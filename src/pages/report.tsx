import { EnvelopeIcon, MapPinIcon, PhoneIcon } from '@heroicons/react/24/solid';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import React, { useRef, useState } from 'react'
import AppLayout from '~/components/layout'
import emailjs from '@emailjs/browser';
import { toast } from 'react-toastify';

const Report = () => {
    const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
//   const { data } = trpc.useQuery(['pageInfo.getContactInfo']);

  const sendEmail = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!userName || !email || !subject || !message) {
      alert('Please fill all the fields!');
      return;
    }
  
    emailjs
      .sendForm(
        process.env.NEXT_PUBLIC_EMAIL_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAIL_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAIL_PUBLIC_ID
      )
      .then(
        (result) => {
          toast.success("Your report is sent!")
        },
        (error) => {
          toast.error("Your report is not sent!")
        }
      );
    setUserName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };
  return (
    <AppLayout>
        <div className="flex flex-col space-y-10 pb-3">
        <h4 className="text-4xl font-semibold text-center">
          You have problems using the app.{' '}
          <span className="underline decoration-yellowColor/50">
            Let&apos;s us know.
          </span>
        </h4>

        <div className="space-y-8">
          <div className="flex items-center justify-center space-x-5">
            <PhoneIcon className="text-yellowColor h-7 w-7 animate-pulse" />
            <p className=" tracking-wider">777520337</p>
          </div>
          <div className="flex items-center justify-center space-x-5">
            <EnvelopeIcon className="text-yellowColor h-7 w-7 animate-pulse" />
            <p>khoa.truongthdk@gmail.com</p>
          </div>
          <div className="flex items-center justify-center space-x-5">
            <MapPinIcon className="text-yellowColor h-7 w-7 animate-pulse" />
            <p>Ho Chi Minh City</p>
          </div>
        </div>

        <form
          ref={formRef}
          onSubmit={sendEmail}
          className="flex flex-col space-y-8 w-fit mx-auto"
        >
          <div className="flex space-x-2">
            <input
              placeholder="Name"
              className="border px-2 py-1 border-primaryColor rounded-md min-w-[400px]"
              type="text"
              name="user_name"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </div>
          <input
              name="user_email"
              placeholder="Email"
              className="border px-2 py-1 border-primaryColor rounded-md min-w-[400px]"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          <input
            name="subject"
            placeholder="Subject"
            className="border px-2 py-1 border-primaryColor rounded-md min-w-[400px]"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
          <textarea
            name="message"
            placeholder="Message"
            className="border px-2 py-1 border-primaryColor rounded-md min-w-[400px]"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
            <button type="submit" className="text-xl mt-3 px-2 py-1 border-2 border-primaryColor font-semibold rounded-md hover:bg-primaryColor hover:text-white ">Send</button>
        </form>
      </div>

    </AppLayout>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
    return {
      props: {
        ...(await serverSideTranslations(locale, ["common"])),
      },
    };
  }

export default Report