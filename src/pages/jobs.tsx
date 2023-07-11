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





export default function Jobs() {
    const { data: session, status, data: sessionData } = useSession()
    const {data} = api.jobcards.getAll.useQuery();
    const [workshop, setWorkshop] = useState("FAB");
 if(session) {
    const filteredData = data?.filter((job) => {
        if (workshop === "") {
            return true;
        }
        return  job.job_workshop === workshop});
   
    return (
        <>
        <Head>
            <title>Jobs</title>
        </Head>
        <main>
        <header className="fixed top-0   bg-white w-full py-3  px-10  border-b-2  border-gray-500" >
            <div className="grid grid-cols-2">
            <div> 
                <Link href='/' className="text-lg text-slate-600 font-semi-bold hover:text-black pr-10" >AI Scheduler</Link>
                <Link href='/jobs' className="text-slate-600 font-bold hover:text-black pr-5">Jobs</Link>
                <Link href='/' className="text-slate-600 font-semi-bold hover:text-black pr-5">Resources</Link>
                <Link href='/' className="text-slate-600 font-semi-bold hover:text-black pr-5">Availability</Link>
                <Link href='/' className="text-slate-600 font-semi-bold hover:text-black hover:bg-gray-50 pr-5">Scheduler</Link>
            </div>
            <div>
                <div className="float-right">
                    <ContextMenu>
                      <ContextMenuTrigger>
                        <Avatar >
                            <AvatarImage src={session.user.image ?? ""} />
                            <AvatarFallback>{session.user.name.split(" ") 
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

            <h1 className="mt-20">Jobs</h1>
      <button
        className="rounded bg-slate-400 px-3 py-1  text-black no-underline transition hover:bg-slate-200"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
      <Button className="mx-2" onClick={()=>setWorkshop("ELEC")}>ELEC</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("FAB")}>FAB</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("HYD")}>HYD</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("MECH")}>MECH</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("M/C")}>M/C</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("NDT")}>NDT</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("P&M")}>P&M</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("PAINT")}>PAINT</Button>
      <Button className="mx-2" onClick={()=>setWorkshop("")}>ALL</Button>
            <p>Session: {JSON.stringify(session)}</p>
            <p>Status: {status}</p>



            <table id="table-1" className="table-fixed mt-10 mx-10">
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
                        <th className="border border-slate-600 text-center">Actions</th>
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
                            <td className="text-center border border-slate-300">{job.start_date.toLocaleDateString()}</td>
                            <td className="text-center border border-slate-300">{job.end_date.toLocaleDateString()}</td>
                            <td className="text-center border border-slate-300"><Link href={`/jobs/${job.id}`}>{job.ctr}</Link></td>
                        </tr>
                    ))}
                </tbody>
            </table>
      

        </main>
        </>
    ) 
            } else {}
}
