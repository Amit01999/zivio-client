import { FaWhatsapp } from 'react-icons/fa';

const whatsappNumber = '8801626085836';
const whatsappMessage = encodeURIComponent(
  'Hello Zivio Living, I want help finding a property.',
);
const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

export default function WhatsAppChatButton() {
  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Zivio Living on WhatsApp"
      data-testid="link-whatsapp-floating-chat"
      className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_16px_36px_rgba(18,140,126,0.36)] transition-all duration-300 hover:-translate-y-1 hover:scale-105 hover:bg-[#20BD5A] focus:outline-none focus:ring-4 focus:ring-[#25D366]/35 md:bottom-8 md:right-8 md:h-[70px] md:w-[70px]"
    >
      <FaWhatsapp className="h-9 w-9 md:h-10 md:w-10" />
    </a>
  );
}
