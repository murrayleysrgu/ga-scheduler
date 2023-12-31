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
    const {data} = api.jobcards.getAll.useQuery();
    const [workshop, setWorkshop] = useState("ELEC");
    const [isLoading, setIsLoading] = useState(false);
    const [scheduled, setScheduled] = useState(false);
    const [isCalculating, setIsCalculating] = useState(false);
    const queryClient = useQueryClient();
    if(session) {        const filteredData = data ? data.filter((job) => {
            if (workshop === "") {
                return true;
            }
            return  job.job_workshop === workshop}) : [];

         // function to import jobs from csv file
         const handleButtonClick = async () => {
         try {
            setIsLoading(true);
            const response = await fetch('/api/import_jobs', {
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
                    }, 10000);
                void queryClient.invalidateQueries();
            }

        }; 


         const handleButtonClickSchedule = async () => {
         try {
            setIsCalculating(true);
            const response = await fetch('/api/schedule_jobs', {
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
                    setIsCalculating(false);
                    setScheduled(true);
                    }, 3000);
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
                    <Link href='/jobs' className="text-slate-600 font-bold hover:text-black pr-5">Jobs</Link>
                    <Link href='/resources' className="text-slate-600 font-semi-bold hover:text-black pr-5">Resources</Link>
                    <Link href='/availability' className="text-slate-600 font-semi-bold hover:text-black pr-5">Availability</Link>
                    <Link href='/' className="text-slate-600 font-semi-bold hover:text-black hover:bg-gray-50 pr-5">Scheduler</Link>
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
          <Button className="mx-2" onClick={()=>setWorkshop("ELEC")}>ELEC</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("FAB")}>FAB</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("HYD")}>HYD</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("MECH")}>MECH</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("M/C")}>M/C</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("NDT")}>NDT</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("P&M")}>P&M</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("PAINT")}>PAINT</Button>
          <Button className="mx-2" onClick={()=>setWorkshop("")}>ALL</Button>
            <div className="float-right">
            {filteredData?.length > 0 ? 
            <Button className="mx-2" disabled={isCalculating} onClick={handleButtonClickSchedule}>{isCalculating ? 'Calculating...' : scheduled ? 'Re-Schedule jobs' : 'Schedule Jobs'}</Button>
            : null }
            <Button className="mx-2" disabled={isLoading} onClick={handleButtonClick}>{isLoading ? 'Loading...' : 'Import Jobs'}</Button>
            </div>


                <div className="text-xs mt-10">{filteredData?.length} Jobs found</div>
                <table id="table-1" className="table-fixed  text-xs mt-2">
                    <thead className="bg-slate-200 my-5">
                        <tr>
                            <th className="border border-slate-600 w-20 text-center">id</th>
                            <th className="border border-slate-600 w-28">Job No</th>
                            <th className="border border-slate-600 w-20 text-center">Card No.</th>
                            <th className="border border-slate-600 w-120px">Work Description</th>
                            <th className="border border-slate-600 w-52">Client</th>
                            <th className="border border-slate-600 w-28 text-center">Workshop</th>
                            <th className="border border-slate-600 w-28 text-center">CTR</th>
                            <th className="border border-slate-600 w-28 text-center">Deadline</th>
                            <th className="border border-slate-600 text-center">Est Start</th>
                            <th className="border border-slate-600 text-center">Est End</th>
                            <th className="border border-slate-600 text-center">Days</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData?.map((job) => (
                            <tr key={job.id} className="hover:bg-slate-100 border border-slate-300">
                                <td className="text-center border border-slate-300">{job.id}</td>
                                <td>{job.job_number}</td>
                                <td className="text-center border border-slate-300">{job.card_number}</td>
                                <td>{job.job_name}</td>
                                <td>{job.job_contact}</td>
                                <td className="text-center border border-slate-300">{job.job_workshop}</td>
                                <td className="text-center border border-slate-300">{job.job_ctr}</td>
                                <td className="text-center border border-slate-300">{job.due_date.toLocaleDateString()}</td>
                                <td className="text-center border border-slate-300">{scheduled ? job.start_date?.toLocaleDateString() : ''}</td>
                                <td className="text-center border border-slate-300">{scheduled ? job.end_date.toLocaleDateString() : ''}</td>
                                <td className="text-center border border-slate-300"><Link href={`/jobs/${job.id}`}>{job.ctr}</Link></td>
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
