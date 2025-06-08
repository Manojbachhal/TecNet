
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import Navbar from '@/components/layout/Navbar';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { useIsMobile } from '@/hooks/use-mobile';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine
} from 'recharts';
import { 
  Crosshair, 
  Wind, 
  Target, 
  Ruler, 
  Thermometer, 
  ChevronUp, 
  ChevronDown,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Share2,
  Download,
  Pencil,
  Save
} from 'lucide-react';
import { caliberToBulletType } from '@/components/ballistics/utils/ballisticsMappings';

// Define bullet types with their ballistic coefficients
const bulletTypes = [
  { id: 'fmj9mm', name: '9mm FMJ', bc: 0.125, weight: 115, diameter: 0.355, initialVelocity: 1180 },
  { id: '223rem', name: '.223 Rem', bc: 0.243, weight: 55, diameter: 0.224, initialVelocity: 3240 },
  { id: '308win', name: '.308 Win', bc: 0.411, weight: 168, diameter: 0.308, initialVelocity: 2680 },
  { id: '6.5cm', name: '6.5 Creedmoor', bc: 0.564, weight: 140, diameter: 0.264, initialVelocity: 2710 },
  { id: '45acp', name: '.45 ACP', bc: 0.195, weight: 230, diameter: 0.452, initialVelocity: 850 },
  { id: '300wm', name: '.300 Win Mag', bc: 0.591, weight: 190, diameter: 0.308, initialVelocity: 2960 },
  { id: '12gauge', name: '12 Gauge Slug', bc: 0.112, weight: 438, diameter: 0.729, initialVelocity: 1560 },
  { id: 'custom', name: 'Custom', bc: 0.3, weight: 150, diameter: 0.308, initialVelocity: 2700 }
];

// Wind speed options
const windSpeeds = [0, 5, 10, 15, 20, 25, 30];

// Define the interfaces for trajectory data
interface TrajectoryPoint {
  distance: number;
  drop: number;
  velocity: number;
  energy: number;
  windage: number;
  time: number;
}

function calculateTrajectory(
  bc: number,          // Ballistic coefficient
  weight: number,      // Bullet weight in grains
  diameter: number,    // Bullet diameter in inches
  muzzleVelocity: number, // Initial velocity in fps
  sightHeight: number, // Sight height in inches
  zeroRange: number,   // Zero range in yards
  angle: number,       // Shooting angle in degrees
  windSpeed: number,   // Wind speed in mph
  windAngle: number,   // Wind angle in degrees
  temperature: number, // Temperature in F
  pressure: number,    // Pressure in inHg
  humidity: number,    // Humidity percentage
  maxRange: number     // Maximum range to calculate
): TrajectoryPoint[] {
  const trajectoryData: TrajectoryPoint[] = [];
  
  // Convert some units
  const weightKg = weight / 15432.4; // grains to kg
  const diameterM = diameter * 0.0254; // inches to m
  const velocityMs = muzzleVelocity * 0.3048; // fps to m/s
  const sightHeightM = sightHeight * 0.0254; // inches to m
  const zeroRangeM = zeroRange * 0.9144; // yards to m
  const windSpeedMs = windSpeed * 0.44704; // mph to m/s
  const angleRad = angle * Math.PI / 180; // degrees to radians
  const windAngleRad = windAngle * Math.PI / 180; // degrees to radians
  
  // Air density calculation based on temperature, pressure, and humidity
  const tempC = (temperature - 32) * 5/9; // F to C
  const pressurePa = pressure * 3386.39; // inHg to Pa
  const satVapPressure = 610.78 * Math.exp((tempC * 17.27) / (tempC + 237.3)); // Magnus formula
  const vapPressure = (humidity / 100) * satVapPressure;
  const dryAirPressure = pressurePa - vapPressure;
  const dryAirDensity = dryAirPressure / (287.05 * (tempC + 273.15));
  const waterVaporDensity = vapPressure / (461.5 * (tempC + 273.15));
  const airDensity = dryAirDensity + waterVaporDensity;
  const airDensityRatio = airDensity / 1.225; // Ratio to standard air density
  
  // Initialize variables for trajectory calculation
  let x = 0; // horizontal distance in m
  let y = 0; // vertical position (height) in m
  let velocity = velocityMs; // current velocity in m/s
  let time = 0; // time of flight in s
  let deltaT = 0.01; // time step in s
  let bulletDrop = 0; // bullet drop in inches
  
  // Calculate initial angle to achieve zero at specified range
  let thetaRad = Math.atan(sightHeightM / zeroRangeM);
  
  // Fine-tune the angle to hit zero
  for (let i = 0; i < 10; i++) {
    // Reset simulation
    x = 0;
    y = sightHeightM;
    velocity = velocityMs;
    time = 0;
    
    const vx = velocity * Math.cos(thetaRad);
    let vy = velocity * Math.sin(thetaRad);
    
    // Run trajectory until zero range
    while (x < zeroRangeM && y > 0) {
      // Calculate drag
      const totalVelocity = Math.sqrt(vx * vx + vy * vy);
      const dragCoefficient = 0.5 * airDensityRatio * bc;
      const drag = dragCoefficient * totalVelocity * totalVelocity;
      
      // Update position
      x += vx * deltaT;
      y += vy * deltaT;
      
      // Update velocity (simplified)
      vy -= 9.81 * deltaT; // gravity effect
      
      time += deltaT;
    }
    
    // Adjust the angle based on where it hit
    if (Math.abs(y) < 0.001) break; // Close enough to zero
    
    thetaRad += (y > 0) ? -0.0001 : 0.0001; // Adjust angle
  }
  
  // Initial values for main trajectory calculation
  x = 0;
  y = sightHeightM;
  velocity = velocityMs;
  time = 0;
  
  // Initial velocity components
  const initialVx = velocity * Math.cos(thetaRad + angleRad);
  const initialVy = velocity * Math.sin(thetaRad + angleRad);
  
  // Wind components
  const windX = windSpeedMs * Math.cos(windAngleRad);
  const windY = windSpeedMs * Math.sin(windAngleRad);
  
  // Calculate trajectory for the range
  for (let distance = 0; distance <= maxRange; distance += 10) {
    // Target distance in meters
    const targetDistanceM = distance * 0.9144;
    
    // Reset simulation variables
    x = 0;
    y = sightHeightM;
    let vx = initialVx;
    let vy = initialVy;
    time = 0;
    
    // Wind drift
    let windDrift = 0;
    
    // Run simulation until we reach target distance
    while (x < targetDistanceM && time < 10) { // 10s timeout
      // Calculate total velocity and drag
      const totalVelocity = Math.sqrt(vx * vx + vy * vy);
      const dragForce = 0.5 * airDensityRatio * totalVelocity * bc;
      
      // Wind effect (simplified)
      const relativeVx = vx - windX;
      windDrift += (windX * deltaT);
      
      // Update velocities with drag
      vx -= (dragForce * relativeVx / totalVelocity) * deltaT;
      vy -= (9.81 + dragForce * vy / totalVelocity) * deltaT;
      
      // Update position
      x += vx * deltaT;
      y += vy * deltaT;
      
      // Update time
      time += deltaT;
    }
    
    // Calculate bullet drop in inches relative to line of sight
    bulletDrop = -y * 39.37;
    
    // Calculate remaining velocity and energy
    const remainingVelocity = Math.sqrt(vx * vx + vy * vy) / 0.3048; // m/s to fps
    const energy = (weight * remainingVelocity * remainingVelocity) / 450240; // ft-lbs
    
    // Calculate windage in inches
    const windageInches = windDrift * 39.37;
    
    // Add data point
    trajectoryData.push({
      distance,
      drop: bulletDrop,
      velocity: remainingVelocity,
      energy: energy,
      windage: windageInches,
      time
    });
  }
  
  return trajectoryData;
}

export default function Ballistics() {
  const { toast } = useToast();
  const isMobile = useIsMobile();
  const location = useLocation();
  
  // Bullet and environment parameters
  const [selectedBulletType, setSelectedBulletType] = useState<string>('223rem');
  const [customBullet, setCustomBullet] = useState(bulletTypes.find(b => b.id === 'custom') || bulletTypes[7]);
  const [bc, setBc] = useState<number>(0.243);
  const [weight, setWeight] = useState<number>(55);
  const [diameter, setDiameter] = useState<number>(0.224);
  const [muzzleVelocity, setMuzzleVelocity] = useState<number>(3240);
  const [sightHeight, setSightHeight] = useState<number>(1.5);
  const [zeroRange, setZeroRange] = useState<number>(100);
  const [angle, setAngle] = useState<number>(0);
  const [windSpeed, setWindSpeed] = useState<number>(10);
  const [windAngle, setWindAngle] = useState<number>(90);
  const [temperature, setTemperature] = useState<number>(59);
  const [pressure, setPressure] = useState<number>(29.92);
  const [humidity, setHumidity] = useState<number>(50);
  const [maxRange, setMaxRange] = useState<number>(500);
  const [currentFirearm, setCurrentFirearm] = useState<any>(null);
  
  // Trajectory data
  const [trajectoryData, setTrajectoryData] = useState<TrajectoryPoint[]>([]);
  const [showAdvancedSettings, setShowAdvancedSettings] = useState<boolean>(false);
  
  // Check for firearm data passed from inventory or trading
  useEffect(() => {
    if (location.state?.firearm) {
      const firearm = location.state.firearm;
      setCurrentFirearm(firearm);
      
      console.log('Received firearm data:', firearm);
      
      // Set bullet type based on caliber
      if (firearm.bulletType) {
        setSelectedBulletType(firearm.bulletType);
      } else if (firearm.caliber) {
        const bulletType = caliberToBulletType[firearm.caliber] || '223rem';
        setSelectedBulletType(bulletType);
      }
      
      // Set zero range if provided
      if (firearm.zeroRange) {
        setZeroRange(firearm.zeroRange);
      }
      
      // Set wind parameters if provided
      if (firearm.windSpeed) {
        setWindSpeed(firearm.windSpeed);
      }
      
      if (firearm.windAngle) {
        setWindAngle(firearm.windAngle);
      }
      
      // Calculate trajectory after a short delay to ensure state updates
      setTimeout(() => {
        calculateAndUpdateTrajectory();
      }, 100);
      
      // Clear location state to prevent reuse on page refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);
  
  // Load bullet data when bullet type changes
  useEffect(() => {
    if (selectedBulletType === 'custom') {
      setBc(customBullet.bc);
      setWeight(customBullet.weight);
      setDiameter(customBullet.diameter);
      setMuzzleVelocity(customBullet.initialVelocity);
    } else {
      const bullet = bulletTypes.find(b => b.id === selectedBulletType);
      if (bullet) {
        setBc(bullet.bc);
        setWeight(bullet.weight);
        setDiameter(bullet.diameter);
        setMuzzleVelocity(bullet.initialVelocity);
      }
    }
  }, [selectedBulletType, customBullet]);
  
  // Calculate trajectory when parameters change
  const calculateAndUpdateTrajectory = () => {
    try {
      const newTrajectory = calculateTrajectory(
        bc,
        weight,
        diameter,
        muzzleVelocity,
        sightHeight,
        zeroRange,
        angle,
        windSpeed,
        windAngle,
        temperature,
        pressure,
        humidity,
        maxRange
      );
      
      setTrajectoryData(newTrajectory);
      
      const displayBulletName = selectedBulletType === 'custom' 
        ? 'Custom Bullet' 
        : bulletTypes.find(b => b.id === selectedBulletType)?.name;
      
      const displayTitle = currentFirearm
        ? `${currentFirearm.make} ${currentFirearm.model}`
        : displayBulletName;
        
      toast({
        title: "Trajectory Calculated",
        description: `Calculated for ${displayTitle} zeroed at ${zeroRange} yards`,
      });
    } catch (error) {
      toast({
        title: "Calculation Error",
        description: "There was an error calculating the trajectory. Please check your inputs.",
        variant: "destructive"
      });
    }
  };
  
  // Calculate trajectory when component loads and after parameter changes
  useEffect(() => {
    if (!location.state?.firearm) {
      // Only auto-calculate on initial load if no firearm is passed
      calculateAndUpdateTrajectory();
    }
  }, []);
  
  // Format values for display
  const formatDecimal = (value: number) => Math.round(value * 100) / 100;
  
  // Find optimal ranges
  const getMaxPointBlankRange = () => {
    if (trajectoryData.length === 0) return { min: 0, max: 0 };
    
    // Assume a 6-inch vital zone (3 inches above and below line of sight)
    const vitalZoneRadius = 3.0;
    
    // Find where trajectory stays within vital zone
    let minRange = 0;
    let maxRange = 0;
    let inVitalZone = false;
    
    trajectoryData.forEach(point => {
      if (Math.abs(point.drop) <= vitalZoneRadius) {
        if (!inVitalZone) {
          minRange = point.distance;
          inVitalZone = true;
        }
        maxRange = point.distance;
      } else if (inVitalZone && point.drop < -vitalZoneRadius) {
        inVitalZone = false;
      }
    });
    
    return { min: minRange, max: maxRange };
  };
  
  // Get maximum effective range (where energy drops below 1000 ft-lbs for rifle, 300 for pistol)
  const getMaxEffectiveRange = () => {
    if (trajectoryData.length === 0) return 0;
    
    // Different energy thresholds based on bullet type
    const isRifle = ['223rem', '308win', '6.5cm', '300wm'].includes(selectedBulletType);
    const energyThreshold = isRifle ? 1000 : 300;
    
    for (let i = 0; i < trajectoryData.length; i++) {
      if (trajectoryData[i].energy < energyThreshold) {
        return trajectoryData[i].distance;
      }
    }
    
    return trajectoryData[trajectoryData.length - 1].distance;
  };
  
  const pointBlankRange = getMaxPointBlankRange();
  const effectiveRange = getMaxEffectiveRange();
  
  // Handler for resetting to defaults
  const handleReset = () => {
    setSelectedBulletType('223rem');
    setZeroRange(100);
    setWindSpeed(10);
    setAngle(0);
    setSightHeight(1.5);
    setTemperature(59);
    setPressure(29.92);
    setHumidity(50);
    setMaxRange(500);
    setCurrentFirearm(null);
    
    toast({
      title: "Reset to Defaults",
      description: "All parameters have been reset to default values."
    });
  };
  
  // Handler for exporting data
  const handleExportData = () => {
    const dataStr = JSON.stringify(trajectoryData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `ballistics_${selectedBulletType}_${zeroRange}yd.json`;
    
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
    
    toast({
      title: "Data Exported",
      description: "Trajectory data has been exported as JSON."
    });
  };

  // Handler for custom bullet updates
  const updateCustomBullet = (property: keyof typeof customBullet, value: number) => {
    setCustomBullet(prev => ({
      ...prev,
      [property]: value
    }));
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 pt-24 pb-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center">
            <Crosshair className="h-8 w-8 mr-2 text-primary" />
            Ballistics Calculator
            {currentFirearm && (
              <Badge variant="outline" className="ml-4 text-lg">
                {currentFirearm.make} {currentFirearm.model}
              </Badge>
            )}
          </h1>
          <p className="text-muted-foreground">
            {currentFirearm 
              ? `Calculating ballistics for ${currentFirearm.make} ${currentFirearm.model} in ${currentFirearm.caliber}` 
              : "Calculate bullet trajectory, drop, and windage for precision shooting."}
          </p>
        </motion.div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Inputs Column */}
          <div className="col-span-1">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Ballistic Parameters
                  </CardTitle>
                  <CardDescription>
                    Select bullet and environment settings
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bulletType">Bullet Type</Label>
                    <Select 
                      value={selectedBulletType} 
                      onValueChange={setSelectedBulletType}
                    >
                      <SelectTrigger id="bulletType">
                        <SelectValue placeholder="Select bullet type" />
                      </SelectTrigger>
                      <SelectContent>
                        {bulletTypes.map(bullet => (
                          <SelectItem key={bullet.id} value={bullet.id}>
                            {bullet.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {selectedBulletType === 'custom' && (
                    <div className="space-y-3 border border-primary/20 p-3 rounded-md">
                      <h4 className="font-medium flex items-center text-sm">
                        <Pencil className="h-3 w-3 mr-1" />
                        Custom Bullet Settings
                      </h4>
                      
                      <div className="grid grid-cols-2 gap-2">
                        <div className="col-span-2 space-y-1">
                          <Label htmlFor="bc" className="text-xs">Ballistic Coefficient</Label>
                          <Input
                            id="bc"
                            type="number"
                            value={customBullet.bc}
                            onChange={(e) => updateCustomBullet('bc', parseFloat(e.target.value))}
                            step="0.001"
                            min="0.1"
                            max="1"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="weight" className="text-xs">Weight (gr)</Label>
                          <Input
                            id="weight"
                            type="number"
                            value={customBullet.weight}
                            onChange={(e) => updateCustomBullet('weight', parseFloat(e.target.value))}
                            step="1"
                            min="1"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="diameter" className="text-xs">Diameter (in)</Label>
                          <Input
                            id="diameter"
                            type="number"
                            value={customBullet.diameter}
                            onChange={(e) => updateCustomBullet('diameter', parseFloat(e.target.value))}
                            step="0.001"
                            min="0.1"
                            className="h-8"
                          />
                        </div>
                        
                        <div className="col-span-2 space-y-1">
                          <Label htmlFor="muzzleVelocity" className="text-xs">Muzzle Velocity (fps)</Label>
                          <Input
                            id="muzzleVelocity"
                            type="number"
                            value={customBullet.initialVelocity}
                            onChange={(e) => updateCustomBullet('initialVelocity', parseFloat(e.target.value))}
                            step="10"
                            min="100"
                            className="h-8"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="zeroRange">Zero Range (yards)</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="zeroRange"
                        type="number"
                        value={zeroRange}
                        onChange={(e) => setZeroRange(parseInt(e.target.value))}
                        className="w-20"
                        min="25"
                        max="1000"
                        step="25"
                      />
                      <Slider
                        value={[zeroRange]}
                        onValueChange={(values) => setZeroRange(values[0])}
                        min={25}
                        max={300}
                        step={25}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="windSpeed">Wind Speed (mph)</Label>
                    <Select 
                      value={windSpeed.toString()} 
                      onValueChange={(val) => setWindSpeed(parseInt(val))}
                    >
                      <SelectTrigger id="windSpeed">
                        <SelectValue placeholder="Select wind speed" />
                      </SelectTrigger>
                      <SelectContent>
                        {windSpeeds.map(speed => (
                          <SelectItem key={speed} value={speed.toString()}>
                            {speed} mph
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="windAngle">Wind Direction</Label>
                    <div className="relative">
                      <Input
                        id="windAngle"
                        type="number"
                        value={windAngle}
                        onChange={(e) => setWindAngle(parseInt(e.target.value))}
                        className="pl-10"
                        min="0"
                        max="359"
                        step="5"
                      />
                      <Wind className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                      <div className="absolute right-3 top-2.5 text-xs text-muted-foreground">
                        {windAngle === 0 ? "Tail" : 
                          windAngle === 90 ? "Right" : 
                          windAngle === 180 ? "Head" : 
                          windAngle === 270 ? "Left" : `${windAngle}°`}
                      </div>
                    </div>
                  </div>
                  
                  <Button
                    onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                    variant="outline"
                    className="w-full"
                  >
                    {showAdvancedSettings ? 
                      <ChevronUp className="mr-2 h-4 w-4" /> : 
                      <ChevronDown className="mr-2 h-4 w-4" />
                    }
                    {showAdvancedSettings ? "Hide Advanced Settings" : "Show Advanced Settings"}
                  </Button>
                  
                  {showAdvancedSettings && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                      className="space-y-4 border-t pt-4 mt-4"
                    >
                      <div className="space-y-2">
                        <Label htmlFor="sightHeight">Sight Height (inches)</Label>
                        <Input
                          id="sightHeight"
                          type="number"
                          value={sightHeight}
                          onChange={(e) => setSightHeight(parseFloat(e.target.value))}
                          step="0.1"
                          min="0.5"
                          max="3"
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="angle">Shooting Angle (degrees)</Label>
                        <div className="flex items-center space-x-2">
                          <Input
                            id="angle"
                            type="number"
                            value={angle}
                            onChange={(e) => setAngle(parseInt(e.target.value))}
                            className="w-20"
                            min="-60"
                            max="60"
                          />
                          <Slider
                            value={[angle]}
                            onValueChange={(values) => setAngle(values[0])}
                            min={-60}
                            max={60}
                            step={5}
                            className="flex-1"
                          />
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <div>Downhill</div>
                          <div>Uphill</div>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-2">
                        <div className="space-y-1">
                          <Label htmlFor="temperature" className="text-xs">Temperature (°F)</Label>
                          <div className="relative">
                            <Input
                              id="temperature"
                              type="number"
                              value={temperature}
                              onChange={(e) => setTemperature(parseInt(e.target.value))}
                              className="pl-7"
                              min="-20"
                              max="120"
                            />
                            <Thermometer className="absolute left-2 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="pressure" className="text-xs">Pressure (inHg)</Label>
                          <Input
                            id="pressure"
                            type="number"
                            value={pressure}
                            onChange={(e) => setPressure(parseFloat(e.target.value))}
                            step="0.01"
                            min="20"
                            max="35"
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor="humidity" className="text-xs">Humidity (%)</Label>
                          <Input
                            id="humidity"
                            type="number"
                            value={humidity}
                            onChange={(e) => setHumidity(parseInt(e.target.value))}
                            min="0"
                            max="100"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="maxRange">Max Range (yards)</Label>
                        <Select 
                          value={maxRange.toString()} 
                          onValueChange={(val) => setMaxRange(parseInt(val))}
                        >
                          <SelectTrigger id="maxRange">
                            <SelectValue placeholder="Maximum calculation range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="300">300 yards</SelectItem>
                            <SelectItem value="500">500 yards</SelectItem>
                            <SelectItem value="1000">1000 yards</SelectItem>
                            <SelectItem value="1500">1500 yards</SelectItem>
                            <SelectItem value="2000">2000 yards</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </motion.div>
                  )}
                </CardContent>
                <CardFooter className="flex justify-between flex-wrap gap-2">
                  <Button 
                    variant="outline" 
                    onClick={handleReset}
                    className="flex-1"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                  <Button 
                    onClick={calculateAndUpdateTrajectory}
                    className="flex-1"
                  >
                    <Crosshair className="mr-2 h-4 w-4" />
                    Calculate
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          </div>
          
          {/* Results Column */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center text-lg">
                    <Crosshair className="h-5 w-5 mr-2 text-primary" />
                    Trajectory Chart
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="drop">
                    <TabsList className="w-full mb-4">
                      <TabsTrigger value="drop" className="flex-1">Bullet Drop</TabsTrigger>
                      <TabsTrigger value="velocity" className="flex-1">Velocity</TabsTrigger>
                      <TabsTrigger value="energy" className="flex-1">Energy</TabsTrigger>
                      <TabsTrigger value="windage" className="flex-1">Windage</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="drop" className="pt-2">
                      <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={trajectoryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                            <XAxis 
                              dataKey="distance" 
                              label={{ value: 'Distance (yards)', position: 'bottom', offset: 0 }} 
                            />
                            <YAxis 
                              label={{ value: 'Bullet Drop (inches)', angle: -90, position: 'insideLeft' }} 
                              domain={['auto', 'auto']}
                            />
                            <Tooltip
                              formatter={(value: number) => [`${formatDecimal(value)} inches`, 'Bullet Drop']}
                              labelFormatter={(label) => `Distance: ${label} yards`}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                            <ReferenceLine y={3} stroke="#66bb6a" strokeDasharray="3 3" label="Upper Vital Zone" />
                            <ReferenceLine y={-3} stroke="#f44336" strokeDasharray="3 3" label="Lower Vital Zone" />
                            <Line
                              type="monotone"
                              dataKey="drop"
                              stroke="#8884d8"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                              name="Bullet Drop"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-4 text-sm">
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#8884d8] mr-2"></div>
                          <span>Zero Range: {zeroRange} yards</span>
                        </div>
                        <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-[#66bb6a] mr-2"></div>
                          <span>Point Blank Range: {pointBlankRange.min}-{pointBlankRange.max} yds</span>
                        </div>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="velocity" className="pt-2">
                      <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={trajectoryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                            <XAxis 
                              dataKey="distance" 
                              label={{ value: 'Distance (yards)', position: 'bottom', offset: 0 }} 
                            />
                            <YAxis 
                              label={{ value: 'Velocity (fps)', angle: -90, position: 'insideLeft' }} 
                              domain={['auto', 'auto']}
                            />
                            <Tooltip
                              formatter={(value: number) => [`${formatDecimal(value)} fps`, 'Velocity']}
                              labelFormatter={(label) => `Distance: ${label} yards`}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <ReferenceLine y={1100} stroke="#ff9800" strokeDasharray="3 3" label="Supersonic" />
                            <Line
                              type="monotone"
                              dataKey="velocity"
                              stroke="#ff7043"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                              name="Bullet Velocity"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="energy" className="pt-2">
                      <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={trajectoryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                            <XAxis 
                              dataKey="distance" 
                              label={{ value: 'Distance (yards)', position: 'bottom', offset: 0 }} 
                            />
                            <YAxis 
                              label={{ value: 'Energy (ft-lbs)', angle: -90, position: 'insideLeft' }} 
                              domain={['auto', 'auto']}
                            />
                            <Tooltip
                              formatter={(value: number) => [`${formatDecimal(value)} ft-lbs`, 'Energy']}
                              labelFormatter={(label) => `Distance: ${label} yards`}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <ReferenceLine y={1000} stroke="#4caf50" strokeDasharray="3 3" label="Rifle Hunting" />
                            <ReferenceLine y={300} stroke="#ff9800" strokeDasharray="3 3" label="Pistol Hunting" />
                            <Line
                              type="monotone"
                              dataKey="energy"
                              stroke="#4db6ac"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                              name="Bullet Energy"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 text-sm flex items-center">
                        <div className="w-3 h-3 rounded-full bg-[#4caf50] mr-2"></div>
                        <span>Maximum Effective Range: {effectiveRange} yards</span>
                      </div>
                    </TabsContent>
                    
                    <TabsContent value="windage" className="pt-2">
                      <div className="h-64 sm:h-80">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart
                            data={trajectoryData}
                            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                          >
                            <CartesianGrid strokeDasharray="3 3" opacity={0.7} />
                            <XAxis 
                              dataKey="distance" 
                              label={{ value: 'Distance (yards)', position: 'bottom', offset: 0 }} 
                            />
                            <YAxis 
                              label={{ value: 'Windage (inches)', angle: -90, position: 'insideLeft' }} 
                              domain={['auto', 'auto']}
                            />
                            <Tooltip
                              formatter={(value: number) => [`${formatDecimal(value)} inches`, 'Wind Drift']}
                              labelFormatter={(label) => `Distance: ${label} yards`}
                            />
                            <Legend verticalAlign="top" height={36} />
                            <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
                            <Line
                              type="monotone"
                              dataKey="windage"
                              stroke="#f06292"
                              strokeWidth={2}
                              dot={false}
                              activeDot={{ r: 4 }}
                              name="Wind Drift"
                            />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                      
                      <div className="mt-4 text-sm flex items-center">
                        <Wind className="h-4 w-4 mr-2 text-muted-foreground" />
                        <span>{windSpeed} mph wind from {
                          windAngle === 0 ? "6 o'clock" : 
                          windAngle === 90 ? "3 o'clock" :
                          windAngle === 180 ? "12 o'clock" :
                          windAngle === 270 ? "9 o'clock" :
                          `${windAngle}°`
                        }</span>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
                <CardFooter className="pt-0 pb-4 flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleExportData}
                  >
                    <Download className="mr-2 h-4 w-4" />
                    Export Data
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Create a shareable URL with parameters
                      const params = new URLSearchParams({
                        bt: selectedBulletType,
                        zr: zeroRange.toString(),
                        ws: windSpeed.toString(),
                        wa: windAngle.toString()
                      });
                      navigator.clipboard.writeText(`${window.location.origin}/ballistics?${params.toString()}`);
                      
                      toast({
                        title: "Link Copied",
                        description: "A shareable link to this calculation has been copied to your clipboard."
                      });
                    }}
                  >
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-primary" />
                    Trajectory Table
                  </CardTitle>
                  <CardDescription>
                    Detailed ballistic data at various distances
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-muted/50 border-b">
                          <th className="px-4 py-2 text-left font-medium">Distance (yd)</th>
                          <th className="px-4 py-2 text-left font-medium">Drop (in)</th>
                          <th className="px-4 py-2 text-left font-medium">Windage (in)</th>
                          <th className="px-4 py-2 text-left font-medium">Velocity (fps)</th>
                          <th className="px-4 py-2 text-left font-medium">Energy (ft-lb)</th>
                          <th className="px-4 py-2 text-left font-medium">Time (s)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trajectoryData
                          .filter(point => point.distance % 50 === 0 || point.distance === zeroRange)
                          .map((point, index) => (
                            <tr 
                              key={index} 
                              className={`
                                border-b 
                                ${point.distance === zeroRange ? 'bg-primary/10' : 
                                  index % 2 === 0 ? 'bg-muted/20' : ''}
                              `}
                            >
                              <td className="px-4 py-2">
                                {point.distance === zeroRange && (
                                  <span className="inline-flex items-center mr-1 text-xs bg-primary/20 text-primary rounded px-1">
                                    Zero
                                  </span>
                                )}
                                {point.distance}
                              </td>
                              <td className="px-4 py-2">
                                {formatDecimal(point.drop)}
                                {point.drop > 0 ? (
                                  <ArrowUp className="inline ml-1 h-3 w-3 text-green-500" />
                                ) : point.drop < 0 ? (
                                  <ArrowDown className="inline ml-1 h-3 w-3 text-red-500" />
                                ) : null}
                              </td>
                              <td className="px-4 py-2">{formatDecimal(point.windage)}</td>
                              <td className="px-4 py-2">{Math.round(point.velocity)}</td>
                              <td className="px-4 py-2">{Math.round(point.energy)}</td>
                              <td className="px-4 py-2">{formatDecimal(point.time)}</td>
                            </tr>
                          ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
      
      <footer className="bg-background border-t border-primary/10 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center">
            <div className="flex items-center mb-2">
              <Crosshair className="h-5 w-5 text-primary mr-2" />
              <span className="text-lg font-semibold">
                <span className="text-primary">Ammo</span>
                <span className="text-foreground">Alley</span>
                <span className="text-primary ml-1">•</span>
              </span>
            </div>
            <p className="text-xs text-muted-foreground text-center max-w-md">
              This ballistics calculator provides estimated values for educational purposes only. 
              Always verify results with live fire testing for critical shooting applications.
            </p>
            <Separator className="my-4 max-w-xs" />
            <p className="text-xs text-muted-foreground">
              © 2023 AmmoAlley. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

// Don't forget to import Badge
import { Badge } from '@/components/ui/badge';
