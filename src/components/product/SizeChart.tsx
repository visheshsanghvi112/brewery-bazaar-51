
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Ruler } from "lucide-react";

export default function SizeChart() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="link" className="px-0 h-auto flex items-center text-muted-foreground hover:text-foreground">
          <Ruler className="h-4 w-4 mr-1" />
          Size Guide
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Size Guide</DialogTitle>
          <DialogDescription>
            Measurements in centimeters (cm)
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4">
          <h3 className="font-medium mb-4">T-Shirts</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Chest (cm)</th>
                  <th className="p-3">Length (cm)</th>
                  <th className="p-3">Shoulder (cm)</th>
                  <th className="p-3">Sleeve (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">XS</td>
                  <td className="p-3">96</td>
                  <td className="p-3">66</td>
                  <td className="p-3">41</td>
                  <td className="p-3">20</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">S</td>
                  <td className="p-3">100</td>
                  <td className="p-3">68</td>
                  <td className="p-3">43</td>
                  <td className="p-3">21</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">M</td>
                  <td className="p-3">104</td>
                  <td className="p-3">70</td>
                  <td className="p-3">45</td>
                  <td className="p-3">22</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">L</td>
                  <td className="p-3">108</td>
                  <td className="p-3">72</td>
                  <td className="p-3">47</td>
                  <td className="p-3">23</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">XL</td>
                  <td className="p-3">112</td>
                  <td className="p-3">74</td>
                  <td className="p-3">49</td>
                  <td className="p-3">24</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6">
          <h3 className="font-medium mb-4">Shorts</h3>
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-secondary text-left">
                <tr>
                  <th className="p-3">Size</th>
                  <th className="p-3">Waist (cm)</th>
                  <th className="p-3">Hip (cm)</th>
                  <th className="p-3">Length (cm)</th>
                  <th className="p-3">Thigh (cm)</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">XS</td>
                  <td className="p-3">70</td>
                  <td className="p-3">88</td>
                  <td className="p-3">41</td>
                  <td className="p-3">58</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">S</td>
                  <td className="p-3">74</td>
                  <td className="p-3">92</td>
                  <td className="p-3">42</td>
                  <td className="p-3">60</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">M</td>
                  <td className="p-3">78</td>
                  <td className="p-3">96</td>
                  <td className="p-3">43</td>
                  <td className="p-3">62</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">L</td>
                  <td className="p-3">82</td>
                  <td className="p-3">100</td>
                  <td className="p-3">44</td>
                  <td className="p-3">64</td>
                </tr>
                <tr className="hover:bg-secondary/50">
                  <td className="p-3 font-medium">XL</td>
                  <td className="p-3">86</td>
                  <td className="p-3">104</td>
                  <td className="p-3">45</td>
                  <td className="p-3">66</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="mt-6 border-t pt-4">
          <h3 className="font-medium mb-2">How to Measure</h3>
          <ul className="text-sm text-muted-foreground space-y-2">
            <li><strong>Chest:</strong> Measure around the fullest part of your chest, keeping the tape horizontal.</li>
            <li><strong>Waist:</strong> Measure around your natural waistline, keeping the tape comfortably loose.</li>
            <li><strong>Hip:</strong> Measure around the fullest part of your hips.</li>
            <li><strong>Length:</strong> For tops, measure from the highest point of the shoulder to the bottom hem. For bottoms, measure from the waistband to the bottom hem.</li>
          </ul>
          <p className="text-sm mt-4 text-muted-foreground">
            If you're between sizes, we recommend choosing the larger size for a more comfortable fit.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
