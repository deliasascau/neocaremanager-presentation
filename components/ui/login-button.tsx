import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function LoginSubmitButton() {
  return (
    <Button 
      type="submit" 
      className="w-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-300"
    >
      Intră în cont
      {/* Iconița cu animația legată de grupul butonului */}
      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover/button:translate-x-1" />
    </Button>
  );
}