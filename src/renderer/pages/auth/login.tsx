import { GalleryVerticalEnd } from "lucide-react"
import logo from "../../assets/svgs/login-logo.svg"
import {LoginForm} from "@/renderer/components/LoginForm"

export default function Login() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
            <div className="relative hidden  lg:block  bg-secondary">
        <img
          src={logo}
          alt="Image"
          className="absolute inset-0 text-center object-contain self-center m-auto dark:brightness-[0.2] dark:grayscale"
        />
      </div>
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Apprex Systems
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm  />
          </div>
        </div>
      </div>

    </div>
  )
}