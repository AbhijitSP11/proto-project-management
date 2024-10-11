import React from 'react'
import {Menu, Moon, Settings, Sun, User} from "lucide-react"
import Link from 'next/link'
import { useAppDispatch, useAppSelector } from '@/app/redux'
import { setIsSidebarCollapsed } from '@/state'
import { useGetAuthUserQuery } from '@/state/api'
import { signOut } from 'aws-amplify/auth'
import Image from 'next/image';
import Search from '../search';
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

const Navbar = () => {
  const { setTheme } = useTheme()
  const dispatch = useAppDispatch();
  const isSidebarCollapsed = useAppSelector((state)=> state.global.isSidebarCollapsed);
  const { theme } = useTheme();
  const isDarkMode = theme === "dark";

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

  return (
    <div className="flex items-center justify-between bg-white dark:bg-dark-bg px-4 py-3">
      <div className="flex items-center gap-8">
      {!isSidebarCollapsed ? null : (
        <button onClick={()=> dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
          <Menu className='h-6 w-6 dark:text-white'/>
        </button> )}
        <div className="relative flex h-min w-[200px]">
          <Search/>
        </div>
      </div>

      {/*Icons*/}
      <div className='flex items-center'>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              <span className="sr-only">Toggle theme</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => setTheme("light")}>
              Light
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("dark")}>
              Dark
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setTheme("system")}>
              System
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        <Link 
          className={ `h-min w-min rounded p-2 ${isDarkMode ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-100'} `}
          href='/settings'>
          <Settings className='w-6 h-6 cursor-pointer dark:text-white'/>
        </Link>
        <div className='ml-2 mr-5 hidden min-h-[2rem] w-[0.1rem] bg-gray-200 md:inline-block'></div>
        <div className='hidden items-center justify-between md:flex'>
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
              className='hidden rounded bg-blue-400 p-2 text-sm font-bold text-white hover:bg-blue-500 md:block'
              onClick={handleSignOut}
              >
              Sign Out
            </button>
        </div>
      </div>
    </div>
  )
}

export default Navbar