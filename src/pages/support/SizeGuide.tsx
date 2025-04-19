
import React from "react";
import { motion } from "framer-motion";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Package } from "lucide-react";

const SizeGuide = () => {
  const containerAnimation = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-16 md:py-24 overflow-hidden bg-gradient-to-br from-background to-secondary/30 border-b border-border">
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <motion.h1 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
            >
              Size Guide
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg text-muted-foreground mb-8"
            >
              Find your perfect fit with our comprehensive size charts.
            </motion.p>
          </div>
        </div>
        
        {/* Decorative elements */}
        <div className="absolute top-1/2 left-10 w-24 h-24 rounded-full bg-primary/5 animate-pulse-glow"></div>
        <div className="absolute bottom-10 right-10 w-32 h-32 rounded-full bg-primary/5 animate-float"></div>
      </section>

      {/* Size Guide Content */}
      <section className="py-16 container mx-auto px-4">
        <Card className="bg-card/50 backdrop-blur-sm border border-border/50">
          <CardHeader>
            <CardTitle className="text-2xl">Size Guide</CardTitle>
            <CardDescription>Find your perfect fit with our comprehensive size charts.</CardDescription>
          </CardHeader>
          <CardContent>
            <motion.div
              variants={containerAnimation}
              initial="hidden"
              animate="visible"
              className="space-y-8"
            >
              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">How to Measure</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium mb-2">Chest / Bust</h4>
                      <p className="text-sm text-muted-foreground">Measure around the fullest part of your chest, keeping the tape measure horizontal.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Waist</h4>
                      <p className="text-sm text-muted-foreground">Measure around your natural waistline, keeping the tape measure horizontal.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Hips</h4>
                      <p className="text-sm text-muted-foreground">Measure around the fullest part of your hips, keeping the tape measure horizontal.</p>
                    </div>
                    <div>
                      <h4 className="font-medium mb-2">Inseam</h4>
                      <p className="text-sm text-muted-foreground">Measure from the crotch to the bottom of the ankle along the inside of the leg.</p>
                    </div>
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">T-Shirts and Tops (in cm)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-left">
                        <th className="p-3 border">Size</th>
                        <th className="p-3 border">Chest</th>
                        <th className="p-3 border">Length</th>
                        <th className="p-3 border">Sleeve</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border">XS</td>
                        <td className="p-3 border">86-91</td>
                        <td className="p-3 border">66</td>
                        <td className="p-3 border">20</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">S</td>
                        <td className="p-3 border">91-96</td>
                        <td className="p-3 border">68</td>
                        <td className="p-3 border">21</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">M</td>
                        <td className="p-3 border">96-101</td>
                        <td className="p-3 border">70</td>
                        <td className="p-3 border">22</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">L</td>
                        <td className="p-3 border">101-106</td>
                        <td className="p-3 border">72</td>
                        <td className="p-3 border">23</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">XL</td>
                        <td className="p-3 border">106-111</td>
                        <td className="p-3 border">74</td>
                        <td className="p-3 border">24</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">XXL</td>
                        <td className="p-3 border">111-116</td>
                        <td className="p-3 border">76</td>
                        <td className="p-3 border">25</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Bottoms (in cm)</h3>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-muted/50 text-left">
                        <th className="p-3 border">Size</th>
                        <th className="p-3 border">Waist</th>
                        <th className="p-3 border">Hips</th>
                        <th className="p-3 border">Inseam</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="p-3 border">XS</td>
                        <td className="p-3 border">68-73</td>
                        <td className="p-3 border">88-93</td>
                        <td className="p-3 border">76</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">S</td>
                        <td className="p-3 border">73-78</td>
                        <td className="p-3 border">93-98</td>
                        <td className="p-3 border">78</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">M</td>
                        <td className="p-3 border">78-83</td>
                        <td className="p-3 border">98-103</td>
                        <td className="p-3 border">80</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">L</td>
                        <td className="p-3 border">83-88</td>
                        <td className="p-3 border">103-108</td>
                        <td className="p-3 border">82</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">XL</td>
                        <td className="p-3 border">88-93</td>
                        <td className="p-3 border">108-113</td>
                        <td className="p-3 border">84</td>
                      </tr>
                      <tr>
                        <td className="p-3 border">XXL</td>
                        <td className="p-3 border">93-98</td>
                        <td className="p-3 border">113-118</td>
                        <td className="p-3 border">86</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </motion.div>

              <motion.div variants={itemAnimation} className="space-y-4">
                <h3 className="text-lg font-semibold">Size Tips</h3>
                <div className="p-4 rounded-lg border bg-card/80 space-y-4">
                  <ul className="list-disc pl-5 space-y-2">
                    <li>If you're between sizes, we recommend sizing up for a more comfortable fit.</li>
                    <li>Our garments may shrink slightly after washing, so please consider this when selecting your size.</li>
                    <li>Different styles may fit differently, so please refer to the specific size information on each product page.</li>
                  </ul>
                </div>
              </motion.div>
            </motion.div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
};

export default SizeGuide;
