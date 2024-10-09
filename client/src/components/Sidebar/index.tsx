"use client"
import { useAppDispatch, useAppSelector } from '@/app/redux';
import { setIsSidebarCollapsed } from '@/state';
import { useGetAuthUserQuery, useGetProjectsQuery } from '@/state/api';
import { signOut } from 'aws-amplify/auth';
import { AlertCircle, AlertOctagon, AlertTriangle, Briefcase, ChevronDown, ChevronRight, ChevronUp, Home, Layers3, Lock, LucideIcon, Search, Settings, ShieldAlert, User, Users, X } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { useState } from 'react'

const SIDEBAR_LINKS: ISidebarLinkProps[] = [
    {
        href: "/", 
        icon: Home, 
        label: "Home"
    },
    {
        href: "/timeline", 
        icon: Briefcase, 
        label: "Timeline"
    },
    {
        href: "/search", 
        icon: Search, 
        label: "Search"
    },
    {
        href: "/settings", 
        icon: Settings, 
        label: "Settings"
    }, 
    {
        href: "/users", 
        icon: User, 
        label: "Users"
    }, 
    {
        href: "/teams", 
        icon: Users, 
        label: "Teams"
    }, 
];


const PRIORITY_LINKS: ISidebarLinkProps[] = [
    {
        href: "/priority/urgent", 
        icon: AlertCircle, 
        label: "Urgent"
    },
    {
        href: "/priority/high", 
        icon: ShieldAlert, 
        label: "High"
    },
    {
        href: "/priority/medium", 
        icon: AlertTriangle, 
        label: "Medium"
    },
    {
        href: "/priority/low", 
        icon: AlertOctagon, 
        label: "Low"
    }, 
    {
        href: "/priority/backlog", 
        icon: Layers3, 
        label: "backlog"
    }
];

const Sidebar = () => {
    const [showProjects, setShowProjects] = useState<boolean>(true);
    const [showPriority, setShowPriority] = useState<boolean>(true);

    const { data: projects } = useGetProjectsQuery();
    const dispatch = useAppDispatch();
    const isSidebarCollapsed = useAppSelector((state)=> state.global.isSidebarCollapsed);

    const {data: currentUser}  = useGetAuthUserQuery({});
  
    const handleSignOut =  async () => {
      try{
        await signOut();
      }catch (error: any){
        console.error("Error signing out", error);  
      }
    };
  
    if(!currentUser) return null;
    const currentUserDetails = currentUser?.userDetails;
    
    const sidebarClassNames = `fixed flex flex-col h-[100%] justify-between shadow-xl
    transition-all duration-300 h-full z-40 dark:bg-black bg-white overflow-hidden ${isSidebarCollapsed ? "w-0" :  "w-64"}
    `;
  return (
    <div className={sidebarClassNames}>
        <div className='flex h-[100%] w-full flex-col justify-start'>
            {/*Logo*/}
            <div className='z-50 flex min-h-[56px] w-64 items-center justify-between bg-white px-6 pt-3 dark:bg-black'>
                <div className='text-xl font-bold text-gray-800 dark:text-white'>
                    Piro
                </div>
                {isSidebarCollapsed ? null : (
                    <button 
                        className='py-3' 
                        onClick={()=> {dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}}
                    >
                        <X className='h-6 w-6 text-gray-800 hover:text-gray-500 dark:text-white'/>
                    </button>)}
            </div>
            {/*Team*/}
            <div className='flex items-center gap-5 border-y-[1.5px] border-gray-100'>
                <Image src={"https://proto-pm-s3-images.s3.ap-south-1.amazonaws.com/logo.png"} alt='logo' width={80} height={80} className='rounded-lg p-2'/>
                <div>
                    <h3 className='text-md font-bold tracking-wide dark:text-white'></h3>
                    <div className='mt-1 flex items-center gap-2'>
                        <Lock className='h-3 w-3 text-gray-300'/>
                        <p className='text-xs text-gray-300'>Private</p>
                    </div>
                </div>
            </div>
            {/*navLinks*/}
            <div className='flex flex-col gap-2 overflow-y-auto'> 
                <nav className='z-10 w-full'>
                    {SIDEBAR_LINKS.map(link => (
                        <SidebarLink
                            key={link.href}
                            icon={link.icon}
                            label={link.label}
                            href={link.href}
                        />
                    )) }
                </nav>
                {/*Project Links*/}
                <button 
                    className='flex w-full text-lg items-center justify-between px-8 text-gray-500 py-2'
                    onClick={()=> setShowProjects(prev => !prev)}>
                        <span className=''>Projects</span>
                        {showProjects ? (<ChevronDown className='h-5 w-5'/>) : 
                        (<ChevronRight className='h-5 w-5'/>)}
                </button>
                {/*Projects List*/}
                <div className='flex flex-col gap-1'>
                    {showProjects && projects?.map((project) => (
                        <SidebarLink key={project.id} icon={Briefcase} label={project.name} href={`/projects/${project.id}`}/>
                    ))}
                </div>
                {/*Priorities Links*/}
                <button 
                    className='flex w-full text-lg items-center justify-between px-8 text-gray-500 py-2'
                    onClick={()=> setShowPriority(prev => !prev)}>
                        <span className=''>Priority</span>
                        {showPriority ? (<ChevronDown className='h-5 w-5'/>) : 
                        (<ChevronRight className='h-5 w-5'/>)}
                </button>
                {showPriority && 
                    PRIORITY_LINKS.map((link => (
                        <SidebarLink href={link.href} icon={link.icon} label={link.label} key={'Priorities'}/>
                    )))
                }
            </div>
        </div>
        <div className='z-10 mt-32 flex w-full flex-col items-center gap-4 bg-white px-8 py-4 dark:bg-black md:hidden'>
            <div className='flex w-full items-center'>
                <div className='align-center flex h-9 w-9 justify-center'>
                {!!currentUserDetails?.profilePictureUrl ? (
                    <Image 
                    src={`https://proto-pm-s3-images.s3.ap-south-1.amazonaws.com/${currentUserDetails?.profilePictureUrl}`}
                    alt={currentUserDetails?.username || "User profile"}
                    width={100}
                    height={100}
                    className="h-full object-cover rounded-full"/>
                ) : (
                    <User className='h-6 w-6 cursor-pointer self-center rounded-full dark:text-white'/>
                )}
                </div>
                <span className='mx-3 text-gray-800 dark:text-white'>{currentUserDetails?.username}</span>
                <button 
                className='self-start rounded bg-blue-400 py-2 text-xs font-bold text-white hover:bg-blue-500 md:block'
                onClick={handleSignOut}
                >
                Sign Out
                </button>
            </div>
        </div>
    </div>
  )
};

interface ISidebarLinkProps {
    href: string; 
    icon: LucideIcon; 
    label: string;
}

const SidebarLink = ({href, icon:Icon, label }: ISidebarLinkProps ) => {
    const pathname = usePathname();
    const isActive = pathname === href || (pathname === "/" && href === "/dashboard");

    return (
            <Link href={href} className='w-full'>
                <div className={`relative flex cursor-pointer items-center gap-3 transition-colors
                    hover:bg-gray-100 dark:bg-black dark:hover:bg-gray-700 px-8 py-3
                    ${isActive ? "bg-gray-100 text-white dark:bg-gray-600": ""}
                    justify-start
                    `}>
                    {isActive && (
                        <div className='absolute left-0 top-0 h-[100%] w-[5px] bg-blue-200'/>
                    )}
                    <Icon className='h-6 w-6 text-gray-800 dark:text-gray-100'/>
                    <span className={`font-medium text-gray-800 dark:text-gray-100`}>
                        {label}
                    </span>
                </div>            
            </Link>
    )

}

export default Sidebar