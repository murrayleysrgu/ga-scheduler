
import Head from "next/head";
import Link from "next/link";
import { SessionProvider, useSession, signIn, signOut } from "next-auth/react"
import { api } from "~/utils/api";
import React, { Component } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"
import { HamburgerMenuIcon} from '@radix-ui/react-icons'
import { Button } from "../components/ui/button";
import {
        
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuIndicator,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuViewport,
  navigationMenuTriggerStyle
    } from "../components/ui/navigation-menu"

import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "../components/ui/context-menu"
import {useState } from "react";
import { useQueryClient } from '@tanstack/react-query'


export default function Jobs() {
    const { data: session, status, data: sessionData } = useSession()
    const {data} = api.jobcards.getCal2.useQuery();
    const [workshop, setWorkshop] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const queryClient = useQueryClient();
 if(session) {
        const filteredData = data ? data.filter((job) => {
            if (workshop === "") {
                return true;
            }
            return  job.job_workshop === workshop}) : [];

  console.log(filteredData); 


         // function to import availability from csv file
         const handleButtonClick = async () => {
         try {
            setIsLoading(true);
            const response = await fetch('/api/import_cal', {
                method: 'POST',
            });
            if (response.ok) {
                const data = await response.json();
                console.log(data); // Handle the response as needed
            } else {
                console.log('An error occurred while loading data.');
            }
            } catch (error) {
                console.log('An error occurred while loading data.', error);
            } finally {
                
                setTimeout(() => {  console.log("Refresh!");
                    queryClient.invalidateQueries();
                    setIsLoading(false);
                    }, 8000);
                void queryClient.invalidateQueries();
            }

        }; 



    return (
        <>
        <Head>
            <title>Jobs</title>
            <link rel="icon" href="/favicon.png" />
        </Head>
        <main>
        <header className="fixed top-0   bg-white w-full py-3  px-10  border-b-2  border-gray-500" >
            <div className="grid grid-cols-2">
            <div> 
                <Link href='/' className="text-lg text-slate-600 font-semi-bold hover:text-black pr-10" >AI Scheduler</Link>
                <Link href='/jobs' className="text-slate-600 font-semi-bold hover:text-black pr-5">Jobs</Link>
                <Link href='/resources' className="text-slate-600 font-semi-bold hover:text-black pr-5">Resources</Link>
                <Link href='/availability' className="text-slate-600 font-bold hover:text-black pr-5">Availability</Link>
            </div>
            <div>
                <div className="float-right">
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <Avatar >
                            <AvatarImage src={session.user?.image ?? ""} />
                            <AvatarFallback>{session.user?.name?.split(" ") 
                            .map((name) => name[0])
                            .join("") ?? ""}</AvatarFallback>
                        </Avatar>
                    </ContextMenuTrigger>
                    <ContextMenuContent>
                        <ContextMenuItem>Profile</ContextMenuItem>
                        <ContextMenuItem>Billing</ContextMenuItem>
                        <ContextMenuItem>Team</ContextMenuItem>
                        <ContextMenuItem>Settings</ContextMenuItem>
                        <ContextMenuItem onClick={()=>void signOut()}>Logout</ContextMenuItem>
                    </ContextMenuContent>
                    </ContextMenu>

                </div> 
              </div>         
            </div>
        </header> 

     <div className="mt-24 mx-10">

        <div className="float-right">
        <Button className="mx-2"onClick={handleButtonClick}>{isLoading ? 'Loading...' : 'Import Calendar'}</Button>
        </div>



            <div className="text-xs mt-10">{filteredData?.length} Calendar entries found</div>
            <table id="table-1" className="table-fixed  text-xs mt-2">
                <thead className="bg-slate-200 my-5">
                    <tr>
                        <th className="border border-slate-600 w-20 text-center">id</th>
                        <th className="border border-slate-600 w-28 text-center">Date</th>
                        <th className="border border-slate-600 w-40 text-left pl-3">Resource</th>
                        <th className="border border-slate-600 w-40 text-left pl-3">Job</th>
                        <th className="border border-slate-600 w-28 text-center">Available Hours</th>
          
                        <th className="border border-slate-600 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredData?.map((job) => (
                        <tr key={job.id} className="hover:bg-slate-100 border border-slate-300">
                            <td className="text-center border border-slate-300">{job.id}</td>
                            <td className="text-center border border-slate-300">{job.availability_date?.toLocaleDateString()}</td>
                            <td className="pl-3">{job.resource.resource_name}</td>
                            <td className="pl-3">{job.job_name}</td>
                            <td className="text-center border border-slate-300" >{job.available_hrs}</td> 
                            <td className="text-center border border-slate-300"><Link href={`/jobs/${job.id}`}>{}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
     </div> 

        </main>
        </>
    ) 
            } else {

            return (

            <>
            <Head>
                <title>Jobs</title>
                <link rel="icon" href="/favicon.png" />
            </Head>
            <main>
            <header className="fixed top-0   bg-white w-full py-3  px-10  border-b-2  border-gray-500" >
                <div className="grid grid-cols-2">
                <div> 
                    <Link href='/' className="text-lg text-slate-600 font-semi-bold hover:text-black pr-10" >AI Scheduler</Link>
                </div>
                <div>
                    <div className="float-right">
            
                               <button onClick={()=>signIn()}>Login</button> 
            

                    </div> 
                  </div>         
                </div>
            </header>
            </main>
            </>
            )

         }
}
