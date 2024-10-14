import React from 'react'
import {LogOut, LogOutIcon, LucideLogOut, Menu, Moon, Settings, Sun, User} from "lucide-react"
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
} from "@/UI/dropdown-menu";
import { Button } from "@/UI/button";

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
    <div className="w-full flex items-center justify-between bg-white dark:bg-dark-bg px-4 py-3">
      <div className="flex items-center gap-8">
      {!isSidebarCollapsed ? null : (
        <button onClick={()=> dispatch(setIsSidebarCollapsed(!isSidebarCollapsed))}>
          <Menu className='h-6 w-6 dark:text-white'/>
        </button> )}
      </div>
      <div className="relative flex h-min w-1/2">
        <Search/>
      </div>

      <div className='flex items-center'>
        <ThemeToggle setTheme={setTheme}/>
       
        <div className='ml-2 mr-5 hidden min-h-[2rem] w-[0.1rem] bg-gray-200 md:inline-block'></div>
        <div className='hidden items-center justify-between md:flex'>
          <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
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
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem className='flex items-center gap-2 p-2'>
              <Link 
                className={ `flex gap-2 items-center h-min w-min rounded ${isDarkMode ? 'dark:hover:bg-gray-700' : 'hover:bg-gray-100'} `}
                href='/settings'>
                <Settings className='size-5 cursor-pointer dark:text-white'/>
                <p>Settings</p>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSignOut} className='flex items-center gap-2 p-2 mt-2 
              border-t border-gray-400 dark:border-gray-600'>
              <LucideLogOut className='size-5'/> 
              <p>Sign Out</p>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
           
            <span className='mx-3 text-gray-800 dark:text-white'>{currentUserDetails?.username}</span>
        </div>
      </div>
    </div>
  )
};


type ThemeProps = {
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

const ThemeToggle = ({setTheme}: ThemeProps) => {
  return (
    <div>
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
      </div>
  )
};


export default Navbar;

