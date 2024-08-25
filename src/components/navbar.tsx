import Link from "next/link";

interface Props {
  className?: string;
}

export function Navbar(props: Props) {
  let className =
    "flex flex-col justify-between bg-base-300 rounded-2xl items-center p-4 md:p-8 md:flex-row";
  if (props.className) className += ` ${props.className}`;

  return (
    <div className="navbar bg-base-100 rounded-xl w-full max-w-[1200px]">
      <div className="navbar-start">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost btn-circle">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h7"
              />
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow"
          >
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Link href="/resources">Resources</Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="navbar-center">
        <Link href="/">
          <h1 className="sm:text-xl">⛽ Ethereum Gas Tracker</h1>
        </Link>
      </div>
      <div className="navbar-end">
        <Link href="/docs">
          <button className="btn btn-outline btn-primary btn-xs sm:btn-sm">API</button>
        </Link>
      </div>
    </div>
  );
}
