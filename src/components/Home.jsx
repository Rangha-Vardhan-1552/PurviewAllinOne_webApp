import React from 'react'

export default function Home() {
  return (
    <>
    <div className='flex gap-4 sm:mx-auto sm:w-full sm:max-w-full justify-center mt-10 '>
        <div className= " flex-col max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl ">
            <a href="/criminal_dash">
                <img className="rounded-t-lg w-full h-72 " src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Cbi_logo.svg/640px-Cbi_logo.svg.png" alt="Crime Department" />
            </a>
            <div className="p-5  hover:bg-blue-400 rounded-md">
                <a href="/criminal_dash" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Go to DashBoard
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>
        <div className=" flex-colmax-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl">
            <a href="/trafficDepartment">
                <img className="rounded-t-lg w-full h-72 " src="https://upload.wikimedia.org/wikipedia/commons/9/91/Hyderabad_Traffic_police_logo.jpg" alt="Traffic Department" />
            </a>
            <div className="p-5  hover:bg-blue-400 rounded-md">
                <a href="/trafficDepartment" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Go to DashBoard
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>
        <div className=" flex-colmax-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700 hover:shadow-2xl ">
            <a href="#">
                <img className="rounded-t-lg w-full h-72 " src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Cbi_logo.svg/640px-Cbi_logo.svg.png" alt="Crime Department" />
            </a>
            <div className="p-5  hover:bg-blue-400 rounded-md">
                <a href="#" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                    Go to DashBoard
                    <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 5h12m0 0L9 1m4 4L9 9"/>
                    </svg>
                </a>
            </div>
        </div>

    </div>
    
      
    </>
  )
}
