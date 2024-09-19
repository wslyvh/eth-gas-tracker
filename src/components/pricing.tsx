import { API_PRICING, API_PAYMENT_URL } from "@/utils/config";

interface Props {
  className?: string;
}

export function Pricing(props: Props) {
  let className = "flex flex-col justify-between bg-base-300 rounded-2xl items-center p-4 md:p-8 md:flex-row";
  if (props.className) className += ` ${props.className}`;

  return (
    <>
      <div className={className}>
        <div className="flex flex-col w-full">
          <span className="text-slate-800 text-2xl font-semibold">
            API Access {/* Pricing */}
          </span>
          <span className="text-slate-600">
            Unlock all features in a simple, transparent package.
          </span>
          <ul className="sm:grid sm:grid-cols-2 sm:grid-rows-2 list-inside text-slate-800 m-0 p-0 mt-4 *:m-0 *:p-0">
            <li>1 API Key for full access</li>
            <li>All endpoints</li>
            <li>Unlimited requests (fair use)</li>
            <li>All networks</li>
          </ul>
          
        </div>
        <div className="flex flex-col text-center  w-full md:w-48 mt-4 md:mt-0 ">
          <span className="text-4xl">€{API_PRICING}.00</span>
          <span className="text-slate-400">billed monthly</span>
          <a
            className="btn btn-primary btn-sm w-full mt-4"
            target="_blank"
            rel="noreferrer"
            href={API_PAYMENT_URL}
          >
            Get Started
          </a>
          <p className='text-xs pt-4 m-0 p-0'>*API key will be sent within 24 hrs after confirmation.</p>
        </div>
      </div>
    </>
  );
}
