// ============================================================
// APEX MACHINERY
// PRODUCTS DATA
// ============================================================
// Local images:
// public/images/machines/
// ============================================================

const productDefinitions = [

  // ==========================================================
  // 1. INDUSTRIAL MACHINERY
  // ==========================================================

  {
    name: "Radial Arm Drilling Machine",
    category: "industrial-machinery",
    categoryName: "Industrial Machinery",
    image: "radial-arm-drilling-machine.jpg",
    specifications: {
      "Drilling Capacity": "80 mm",
      "Arm Length": "2,500 mm",
      "Spindle Taper": "MT5",
      "Spindle Speed": "16–1,600 rpm",
      "Column Diameter": "600 mm",
      "Motor Power": "7.5 kW",
      "Voltage": "380–415V, 3 Phase",
      "Machine Weight": "6,500 kg"
    }
  },

  {
    name: "Industrial Surface Grinding Machine",
    category: "industrial-machinery",
    categoryName: "Industrial Machinery",
    image: "industrial-surface-grinding-machine.jpg",
    specifications: {
      "Grinding Area": "600 × 300 mm",
      "Grinding Wheel": "300 mm",
      "Spindle Speed": "2,850 rpm",
      "Table Travel": "700 mm",
      "Table Load": "300 kg",
      "Motor Power": "5.5 kW",
      "Voltage": "380–415V, 3 Phase",
      "Machine Weight": "2,800 kg"
    }
  },

  {
    name: "Industrial Belt Conveyor System",
    category: "industrial-machinery",
    categoryName: "Industrial Machinery",
    image: "industrial-belt-conveyor-system.jpg",
    specifications: {
      "Conveyor Length": "10 m",
      "Belt Width": "600 mm",
      "Maximum Load": "500 kg/m",
      "Belt Speed": "0.5–2.0 m/s",
      "Drive Motor": "5.5 kW",
      "Frame Material": "Carbon Steel",
      "Voltage": "380–415V, 3 Phase",
      "Control": "Variable Speed"
    }
  },

  {
    name: "Plate Rolling Machine Industrial",
    category: "industrial-machinery",
    categoryName: "Industrial Machinery",
    image: "plate-rolling-machine-industrial.jpg",
    specifications: {
      "Rolling Width": "2,000 mm",
      "Maximum Plate Thickness": "20 mm",
      "Roll Diameter": "250 mm",
      "Motor Power": "11 kW",
      "Voltage": "380–415V",
      "Roll Material": "Forged Steel",
      "Control": "Hydraulic",
      "Machine Weight": "5,500 kg"
    }
  },

  {
    name: "CNC Milling Center Heavy-Duty",
    category: "industrial-machinery",
    categoryName: "Industrial Machinery",
    image: "cnc-milling-center-heavy-duty.jpg",
    specifications: {
      "Table Size": "1,200 × 600 mm",
      "Spindle Speed": "8,000 rpm",
      "Spindle Taper": "BT40",
      "Travel X": "1,000 mm",
      "Travel Y": "600 mm",
      "Travel Z": "600 mm",
      "Motor Power": "15 kW",
      "Control": "CNC"
    }
  },


  // ==========================================================
  // 2. METAL WORKING
  // ==========================================================

  {
    name: "MIG Welding Machine",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "mig-welding-machine.jpg",
    specifications: {
      "Welding Current": "40–350 A",
      "Input Voltage": "380V, 3 Phase",
      "Duty Cycle": "60% at 350 A",
      "Wire Diameter": "0.8–1.2 mm",
      "Welding Process": "MIG/MAG",
      "Protection Rating": "IP21S",
      "Cooling": "Fan Cooled",
      "Weight": "28 kg"
    }
  },

  {
    name: "Industrial TIG Welding Machine",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "industrial-tig-welding-machine.jpg",
    specifications: {
      "Welding Current": "10–315 A",
      "Input Voltage": "220–240V",
      "Welding Type": "AC/DC TIG",
      "Duty Cycle": "60% at 315 A",
      "Electrode Diameter": "1.6–4.0 mm",
      "Protection Rating": "IP23",
      "Cooling": "Fan Cooled",
      "Weight": "24 kg"
    }
  },

  {
    name: "Industrial ARC Welding Machine",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "industrial-arc-welding-machine.jpg",
    specifications: {
      "Welding Current": "20–400 A",
      "Input Voltage": "380V",
      "Duty Cycle": "60%",
      "Electrode Diameter": "1.6–5.0 mm",
      "Welding Process": "MMA / ARC",
      "Protection Rating": "IP21",
      "Cooling": "Fan Cooled",
      "Weight": "32 kg"
    }
  },

  {
    name: "Plasma Cutter 60A Heavy-Duty",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "plasma-cutter-60a-heavy-duty.jpg",
    specifications: {
      "Cutting Current": "20–60 A",
      "Maximum Cutting Thickness": "25 mm",
      "Input Voltage": "380V",
      "Duty Cycle": "60%",
      "Cutting Method": "Plasma",
      "Cooling": "Air Cooled",
      "Protection Rating": "IP21",
      "Weight": "18 kg"
    }
  },

  {
    name: "Metal Cutting Bandsaw Elite",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "metal-cutting-bandsaw-elite.jpg",
    specifications: {
      "Cutting Capacity": "250 mm",
      "Blade Size": "2,500 × 27 × 0.9 mm",
      "Blade Speed": "20–80 m/min",
      "Motor Power": "2.2 kW",
      "Voltage": "380V",
      "Cutting Angle": "0–45°",
      "Frame": "Heavy Duty Steel",
      "Weight": "420 kg"
    }
  },

  {
    name: "Bench Grinder 8-Inch",
    category: "metal-working",
    categoryName: "Metal Working",
    image: "bench-grinder-8-inch.jpg",
    specifications: {
      "Wheel Diameter": "200 mm",
      "Motor Power": "0.75 kW",
      "Speed": "2,850 rpm",
      "Voltage": "220–240V",
      "Wheel Type": "Grinding",
      "Protection": "IP20",
      "Application": "Workshop Grinding",
      "Weight": "25 kg"
    }
  },


  // ==========================================================
  // 3. POWER TOOLS
  // ==========================================================

  {
    name: "Electric Jigsaw Industrial",
    category: "power-tools",
    categoryName: "Power Tools",
    image: "electric-jigsaw-industrial.jpg",
    specifications: {
      "Motor Power": "850 W",
      "Cutting Capacity": "135 mm",
      "Stroke Rate": "800–3,000 spm",
      "Stroke Length": "26 mm",
      "Voltage": "220–240V",
      "Blade Type": "T-Shank",
      "Speed Control": "Variable",
      "Weight": "3.2 kg"
    }
  },

  {
    name: "Circular Saw 190mm Heavy-Duty",
    category: "power-tools",
    categoryName: "Power Tools",
    image: "circular-saw-190mm-heavy-duty.jpg",
    specifications: {
      "Blade Diameter": "190 mm",
      "Motor Power": "1,800 W",
      "No Load Speed": "5,800 rpm",
      "Cutting Depth": "65 mm",
      "Voltage": "220–240V",
      "Blade Bore": "30 mm",
      "Cutting Angle": "0–45°",
      "Weight": "5.2 kg"
    }
  },

  {
    name: "Angle Grinder 9-Inch",
    category: "power-tools",
    categoryName: "Power Tools",
    image: "angle-grinder-9-inch.jpg",
    specifications: {
      "Disc Diameter": "230 mm",
      "Motor Power": "2,200 W",
      "No Load Speed": "6,600 rpm",
      "Voltage": "220–240V",
      "Spindle Thread": "M14",
      "Protection": "Overload Protection",
      "Handle": "Three Position",
      "Weight": "5.8 kg"
    }
  },

  {
    name: "Rotary Hammer SDS-Plus Pro",
    category: "power-tools",
    categoryName: "Power Tools",
    image: "rotary-hammer-sds-plus-pro.jpg",
    specifications: {
      "Motor Power": "900 W",
      "Impact Energy": "3.2 J",
      "Impact Rate": "4,000 bpm",
      "Drilling Capacity": "32 mm",
      "Chuck Type": "SDS-Plus",
      "Voltage": "220–240V",
      "Modes": "3 Mode",
      "Weight": "4.1 kg"
    }
  },


  // ==========================================================
// 4. COMPRESSORS
// ==========================================================

{
  name: "Heavy Duty Air Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "heavy-duty-air-compressor.jpg",
  specifications: {
    "Air Delivery": "1,200 L/min",
    "Maximum Pressure": "10 bar",
    "Tank Capacity": "500 L",
    "Motor Power": "7.5 kW",
    "Voltage": "380–415V",
    "Pump Type": "Reciprocating",
    "Cooling": "Air Cooled",
    "Weight": "320 kg"
  }
},

{
  name: "Rotary Screw Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "rotary-screw-compressor.jpg",
  specifications: {
    "Air Delivery": "2,100 L/min",
    "Maximum Pressure": "10 bar",
    "Motor Power": "15 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Rotary Screw",
    "Control": "Load / Unload",
    "Cooling": "Air Cooled",
    "Weight": "480 kg"
  }
},

{
  name: "Industrial Screw Compressor 22 kW",
  category: "compressors",
  categoryName: "Compressors",
  image: "industrial-screw-compressor-22kw.jpg",
  specifications: {
    "Air Delivery": "3,200 L/min",
    "Maximum Pressure": "10 bar",
    "Motor Power": "22 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Rotary Screw",
    "Control": "Automatic Load / Unload",
    "Cooling": "Air Cooled",
    "Weight": "650 kg"
  }
},

{
  name: "Industrial Screw Compressor 30 kW",
  category: "compressors",
  categoryName: "Compressors",
  image: "industrial-screw-compressor-30kw.jpg",
  specifications: {
    "Air Delivery": "4,500 L/min",
    "Maximum Pressure": "10 bar",
    "Motor Power": "30 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Rotary Screw",
    "Control": "PLC Automatic",
    "Cooling": "Air Cooled",
    "Weight": "820 kg"
  }
},

{
  name: "Industrial Screw Compressor 37 kW",
  category: "compressors",
  categoryName: "Compressors",
  image: "industrial-screw-compressor-37kw.jpg",
  specifications: {
    "Air Delivery": "5,500 L/min",
    "Maximum Pressure": "12 bar",
    "Motor Power": "37 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Rotary Screw",
    "Control": "PLC Automatic",
    "Cooling": "Air Cooled",
    "Weight": "950 kg"
  }
},

{
  name: "Heavy Industrial Screw Compressor 45 kW",
  category: "compressors",
  categoryName: "Compressors",
  image: "heavy-industrial-screw-compressor-45kw.jpg",
  specifications: {
    "Air Delivery": "6,500 L/min",
    "Maximum Pressure": "12 bar",
    "Motor Power": "45 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Rotary Screw",
    "Control": "PLC Automatic",
    "Cooling": "Air Cooled",
    "Weight": "1,200 kg"
  }
},

{
  name: "Portable Diesel Air Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "portable-diesel-air-compressor.jpg",
  specifications: {
    "Air Delivery": "2,500 L/min",
    "Maximum Pressure": "12 bar",
    "Engine Power": "35 HP",
    "Fuel": "Diesel",
    "Compressor Type": "Rotary Screw",
    "Cooling": "Air Cooled",
    "Starting": "Electric Start",
    "Weight": "780 kg"
  }
},

{
  name: "High Pressure Air Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "high-pressure-air-compressor.jpg",
  specifications: {
    "Air Delivery": "1,000 L/min",
    "Maximum Pressure": "30 bar",
    "Motor Power": "18.5 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Two Stage",
    "Cooling": "Air Cooled",
    "Control": "Automatic",
    "Weight": "540 kg"
  }
},

{
  name: "Oil-Free Industrial Air Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "oil-free-industrial-air-compressor.jpg",
  specifications: {
    "Air Delivery": "900 L/min",
    "Maximum Pressure": "8 bar",
    "Motor Power": "5.5 kW",
    "Voltage": "220–240V",
    "Compressor Type": "Oil Free",
    "Cooling": "Air Cooled",
    "Application": "Medical / Food / Laboratory",
    "Weight": "180 kg"
  }
},

{
  name: "Industrial Reciprocating Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "industrial-reciprocating-compressor.jpg",
  specifications: {
    "Air Delivery": "1,500 L/min",
    "Maximum Pressure": "12 bar",
    "Tank Capacity": "500 L",
    "Motor Power": "11 kW",
    "Voltage": "380–415V",
    "Pump Type": "Two Stage Reciprocating",
    "Cooling": "Air Cooled",
    "Weight": "380 kg"
  }
},

{
  name: "Workshop Air Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "workshop-air-compressor.jpg",
  specifications: {
    "Air Delivery": "650 L/min",
    "Maximum Pressure": "8 bar",
    "Tank Capacity": "300 L",
    "Motor Power": "4 kW",
    "Voltage": "220–240V",
    "Pump Type": "Reciprocating",
    "Cooling": "Air Cooled",
    "Weight": "150 kg"
  }
},

{
  name: "Two Stage Industrial Compressor",
  category: "compressors",
  categoryName: "Compressors",
  image: "two-stage-industrial-compressor.jpg",
  specifications: {
    "Air Delivery": "1,800 L/min",
    "Maximum Pressure": "15 bar",
    "Tank Capacity": "750 L",
    "Motor Power": "15 kW",
    "Voltage": "380–415V",
    "Compressor Type": "Two Stage Reciprocating",
    "Cooling": "Air Cooled",
    "Weight": "520 kg"
  }
},


  // ==========================================================
  // 5. GENERATORS
  // ==========================================================

  {
    name: "Industrial Diesel Generator 10 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-10-kva.jpg",
    specifications: {
      "Rated Power": "10 kVA",
      "Prime Power": "8 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 20 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-20-kva.jpg",
    specifications: {
      "Rated Power": "20 kVA",
      "Prime Power": "16 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 30 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-30-kva.jpg",
    specifications: {
      "Rated Power": "30 kVA",
      "Prime Power": "24 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 50 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-50-kva.jpg",
    specifications: {
      "Rated Power": "50 kVA",
      "Prime Power": "40 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 75 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-75-kva.jpg",
    specifications: {
      "Rated Power": "75 kVA",
      "Prime Power": "60 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 100 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-100-kva.jpg",
    specifications: {
      "Rated Power": "100 kVA",
      "Prime Power": "80 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 150 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-150-kva.jpg",
    specifications: {
      "Rated Power": "150 kVA",
      "Prime Power": "120 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 200 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-200-kva.jpg",
    specifications: {
      "Rated Power": "200 kVA",
      "Prime Power": "160 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 250 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-250-kva.jpg",
    specifications: {
      "Rated Power": "250 kVA",
      "Prime Power": "200 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 300 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-300-kva.jpg",
    specifications: {
      "Rated Power": "300 kVA",
      "Prime Power": "240 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 400 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-400-kva.jpg",
    specifications: {
      "Rated Power": "400 kVA",
      "Prime Power": "320 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  {
    name: "Industrial Diesel Generator 500 kVA",
    category: "generators",
    categoryName: "Generators",
    image: "industrial-diesel-generator-500-kva.jpg",
    specifications: {
      "Rated Power": "500 kVA",
      "Prime Power": "400 kW",
      "Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Fuel": "Diesel",
      "Cooling": "Water Cooled",
      "Starting": "Electric Start",
      "Generator Type": "Open Frame"
    }
  },

  // ==========================================================
  // 6. HYDRAULICS
  // ==========================================================

  {
    name: "Hydraulic Hose Assembly",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-hose-assembly.jpg",
    specifications: {
      "Inner Diameter": "1 inch",
      "Working Pressure": "250 bar",
      "Burst Pressure": "1,000 bar",
      "Length": "5 m",
      "Reinforcement": "4-Wire Steel",
      "Cover": "Synthetic Rubber",
      "Fittings": "JIC",
      "Temperature Range": "-40°C to +100°C"
    }
  },

  {
    name: "Hydraulic Piston Pump",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-piston-pump.jpg",
    specifications: {
      "Pump Type": "Axial Piston",
      "Displacement": "75 cc/rev",
      "Flow Rate": "150 L/min",
      "Maximum Pressure": "315 bar",
      "Operating Speed": "1,500 rpm",
      "Control": "Variable Displacement",
      "Drive": "Direct Drive",
      "Weight": "52 kg"
    }
  },

  {
    name: "Hydraulic Valve Block",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-valve-block.jpg",
    specifications: {
      "Valve Type": "Directional Control Valve",
      "Ports": "G1/2",
      "Maximum Pressure": "315 bar",
      "Flow Capacity": "80 L/min",
      "Number of Sections": "4",
      "Actuation": "Solenoid",
      "Body Material": "Cast Iron",
      "Application": "Industrial Hydraulic Systems"
    }
  },

  {
    name: "Hydraulic Motor",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-motor.jpg",
    specifications: {
      "Motor Type": "Orbital Hydraulic Motor",
      "Displacement": "400 cc/rev",
      "Maximum Pressure": "200 bar",
      "Maximum Speed": "500 rpm",
      "Torque": "1,100 Nm",
      "Flow Rate": "180 L/min",
      "Shaft Type": "Splined",
      "Weight": "38 kg"
    }
  },

  {
    name: "Hydraulic Oil Filter",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-oil-filter.jpg",
    specifications: {
      "Filter Type": "Return Line Filter",
      "Filtration Rating": "10 Micron",
      "Flow Capacity": "120 L/min",
      "Maximum Pressure": "16 bar",
      "Port Size": "1 inch",
      "Filter Material": "Synthetic Fibre",
      "Indicator": "Visual Clogging Indicator",
      "Weight": "8 kg"
    }
  },

  {
    name: "Hydraulic Scissor Lift",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-scissor-lift.jpg",
    specifications: {
      "Lifting Capacity": "3 Ton",
      "Minimum Height": "250 mm",
      "Maximum Height": "1,200 mm",
      "Platform Size": "1,200 × 800 mm",
      "Hydraulic Pressure": "180 bar",
      "Motor Power": "2.2 kW",
      "Voltage": "220–240V",
      "Weight": "420 kg"
    }
  },

  {
    name: "Hydraulic Bottle Jack",
    category: "hydraulics",
    categoryName: "Hydraulics",
    image: "hydraulic-bottle-jack.jpg",
    specifications: {
      "Lifting Capacity": "20 Ton",
      "Minimum Height": "240 mm",
      "Maximum Height": "460 mm",
      "Stroke": "150 mm",
      "Safety Valve": "Overload Protection",
      "Pump Type": "Manual",
      "Body Material": "Steel",
      "Weight": "15 kg"
    }
  },


  // ==========================================================
  // 7. CONSTRUCTION EQUIPMENT
  // ==========================================================

  {
    name: "350L Concrete Mixer",
    category: "construction-equipment",
    categoryName: "Construction Equipment",
    image: "350l-concrete-mixer.jpg",
    specifications: {
      "Drum Capacity": "350 L",
      "Mixing Capacity": "280 L",
      "Motor Power": "5.5 kW",
      "Voltage": "380–415V",
      "Drum Speed": "20 rpm",
      "Discharge Type": "Manual Tilt",
      "Frame": "Heavy Duty Steel",
      "Weight": "650 kg"
    }
  },

  {
    name: "Petrol Concrete Vibrator",
    category: "construction-equipment",
    categoryName: "Construction Equipment",
    image: "petrol-concrete-vibrator.jpg",
    specifications: {
      "Engine Power": "5.5 HP",
      "Vibration Frequency": "12,000 vpm",
      "Flexible Shaft": "6 m",
      "Vibrator Head": "50 mm",
      "Fuel": "Petrol",
      "Cooling": "Air Cooled",
      "Engine Type": "4 Stroke",
      "Weight": "35 kg"
    }
  },

  {
    name: "Plate Compactor",
    category: "construction-equipment",
    categoryName: "Construction Equipment",
    image: "plate-compactor.jpg",
    specifications: {
      "Engine Power": "5.5 HP",
      "Plate Size": "500 × 350 mm",
      "Compaction Force": "15 kN",
      "Travel Speed": "20 m/min",
      "Fuel": "Petrol",
      "Water Tank": "Optional",
      "Application": "Soil / Paving",
      "Weight": "85 kg"
    }
  },


  // ==========================================================
  // 8. ELECTRICAL EQUIPMENT
  // ==========================================================

  {
    name: "Industrial Distribution Panel",
    category: "electrical-equipment",
    categoryName: "Electrical Equipment",
    image: "industrial-distribution-panel.jpg",
    specifications: {
      "Rated Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Main Breaker": "MCCB",
      "Protection": "IP54",
      "Busbar": "Copper",
      "Enclosure": "Powder Coated Steel",
      "Control": "Manual / Automatic"
    }
  },

  {
    name: "Automatic Power Factor Correction Panel",
    category: "electrical-equipment",
    categoryName: "Electrical Equipment",
    image: "automatic-power-factor-correction-panel.jpg",
    specifications: {
      "Capacity": "200 kVAr",
      "System Voltage": "400V",
      "Frequency": "50 Hz",
      "Phase": "3 Phase",
      "Control": "Automatic",
      "Capacitor Steps": "25–50 kVAr",
      "Protection": "Fuse + MCCB",
      "Enclosure": "IP54"
    }
  },


  // ==========================================================
  // 9. INDUSTRIAL AUTOMATION
  // ==========================================================

  {
    name: "Industrial PLC Control System",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "industrial-plc-control-system.jpg",
    specifications: {
      "CPU": "High Speed PLC",
      "Digital Inputs": "32",
      "Digital Outputs": "32",
      "Analog Inputs": "8",
      "Communication": "Ethernet + RS485",
      "Supply Voltage": "24V DC",
      "Memory": "1 MB",
      "Protocol": "Modbus TCP/IP"
    }
  },

  {
    name: "10-Inch Industrial HMI Panel",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "10-inch-industrial-hmi-panel.jpg",
    specifications: {
      "Screen Size": "10.1 inch",
      "Resolution": "1280 × 800",
      "Touch Type": "Capacitive",
      "Supply Voltage": "24V DC",
      "Communication": "Ethernet / RS485",
      "Protection Rating": "IP65 Front",
      "Operating Temperature": "0–50°C",
      "Mounting": "Panel Mount"
    }
  },

  {
    name: "SCADA Industrial Control System",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "scada-industrial-control-system.jpg",
    specifications: {
      "System Type": "SCADA",
      "Communication": "Ethernet TCP/IP",
      "Protocol Support": "Modbus / OPC",
      "Data Logging": "Yes",
      "Alarm Management": "Yes",
      "Remote Monitoring": "Supported",
      "User Accounts": "Multi-Level",
      "Database": "SQL Compatible"
    }
  },

  {
    name: "Industrial Robotic Arm",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "industrial-robotic-arm.jpg",
    specifications: {
      "Payload": "20 kg",
      "Reach": "1,700 mm",
      "Number of Axes": "6",
      "Repeatability": "±0.05 mm",
      "Mounting": "Floor / Ceiling",
      "Protection Rating": "IP54",
      "Controller": "Dedicated Robot Controller",
      "Application": "Material Handling"
    }
  },

  {
    name: "Variable Frequency Drive 15 kW",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "variable-frequency-drive-15kw.jpg",
    specifications: {
      "Motor Power": "15 kW",
      "Input Voltage": "380–480V",
      "Output Voltage": "0–480V",
      "Rated Current": "32 A",
      "Frequency Range": "0–400 Hz",
      "Control Method": "Vector / V/F",
      "Protection Rating": "IP20",
      "Communication": "Modbus RTU"
    }
  },

  {
    name: "Industrial Servo Motor",
    category: "industrial-automation",
    categoryName: "Industrial Automation",
    image: "industrial-servo-motor.jpg",
    specifications: {
      "Motor Power": "2 kW",
      "Rated Speed": "3,000 rpm",
      "Rated Torque": "6.4 Nm",
      "Encoder": "Absolute Encoder",
      "Voltage": "220V",
      "Protection Rating": "IP65",
      "Control": "Servo Drive",
      "Application": "Industrial Automation"
    }
  },


  // ==========================================================
  // 10. MATERIAL HANDLING
  // ==========================================================

  {
    name: "Electric Chain Hoist",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "electric-chain-hoist.jpg",
    specifications: {
      "Lifting Capacity": "5 Ton",
      "Lifting Speed": "4 m/min",
      "Lift Height": "6 m",
      "Motor Power": "7.5 kW",
      "Voltage": "380–415V",
      "Chain Diameter": "10 mm",
      "Control": "Pendant",
      "Weight": "220 kg"
    }
  },

  {
    name: "10 Ton Wire Rope Hoist",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "10-ton-wire-rope-hoist.jpg",
    specifications: {
      "Lifting Capacity": "10 Ton",
      "Lifting Speed": "5 m/min",
      "Lift Height": "9 m",
      "Motor Power": "11 kW",
      "Voltage": "380–415V",
      "Rope Diameter": "12 mm",
      "Control": "Pendant / Radio",
      "Weight": "650 kg"
    }
  },

  {
    name: "Manual Chain Block 5 Ton",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "manual-chain-block-5-ton.jpg",
    specifications: {
      "Lifting Capacity": "5 Ton",
      "Standard Lift": "3 m",
      "Load Chain": "10 mm",
      "Number of Falls": "2",
      "Hook Type": "Forged Steel",
      "Safety Latch": "Yes",
      "Operation": "Manual",
      "Weight": "42 kg"
    }
  },

  {
    name: "Industrial Hydraulic Lift Table",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "industrial-hydraulic-lift-table.jpg",
    specifications: {
      "Lifting Capacity": "2,000 kg",
      "Minimum Height": "300 mm",
      "Maximum Height": "1,600 mm",
      "Platform Size": "1,300 × 850 mm",
      "Motor Power": "2.2 kW",
      "Voltage": "380–415V",
      "Lift Type": "Scissor",
      "Weight": "450 kg"
    }
  },

  {
    name: "Industrial Material Trolley",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "industrial-material-trolley.jpg",
    specifications: {
      "Load Capacity": "1,000 kg",
      "Platform Size": "1,500 × 900 mm",
      "Frame Material": "Steel",
      "Wheel Diameter": "200 mm",
      "Wheel Type": "Heavy Duty Castor",
      "Handle": "Push Handle",
      "Brakes": "2 Locking Wheels",
      "Weight": "85 kg"
    }
  },

  {
    name: "Industrial Drum Lifter",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "industrial-drum-lifter.jpg",
    specifications: {
      "Lifting Capacity": "500 kg",
      "Drum Capacity": "200 L",
      "Lift Height": "1,500 mm",
      "Operation": "Manual Hydraulic",
      "Drum Type": "Steel / Plastic",
      "Wheel Type": "PU",
      "Frame": "Powder Coated Steel",
      "Weight": "145 kg"
    }
  },

  {
    name: "Heavy Duty Hand Pallet Truck",
    category: "material-handling",
    categoryName: "Material Handling",
    image: "heavy-duty-hand-pallet-truck.jpg",
    specifications: {
      "Rated Capacity": "3,000 kg",
      "Fork Length": "1,220 mm",
      "Fork Width": "685 mm",
      "Minimum Fork Height": "75 mm",
      "Maximum Fork Height": "195 mm",
      "Pump Type": "Hydraulic",
      "Wheel Material": "Polyurethane",
      "Weight": "95 kg"
    }
  },


  // ==========================================================
  // 11. KITCHEN EQUIPMENT
  // ==========================================================

  {
    name: "Commercial Gas Cooking Range",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-gas-cooking-range.jpg",
    specifications: {
      "Burners": "6 Heavy Duty Burners",
      "Fuel Type": "LPG / Natural Gas",
      "Frame Material": "Stainless Steel",
      "Cooking Surface": "Heavy Duty Steel",
      "Burner Power": "3.5 kW Each",
      "Ignition": "Manual",
      "Application": "Hotels / Restaurants / Catering",
      "Weight": "85 kg"
    }
  },

  {
    name: "Commercial Electric Oven",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-electric-oven.jpg",
    specifications: {
      "Capacity": "120 L",
      "Power": "6 kW",
      "Voltage": "380–415V",
      "Temperature Range": "50–300°C",
      "Chambers": "2",
      "Construction": "Stainless Steel",
      "Control": "Digital",
      "Application": "Commercial Kitchen"
    }
  },

  {
    name: "Industrial Dough Mixer",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "industrial-dough-mixer.jpg",
    specifications: {
      "Bowl Capacity": "50 L",
      "Dough Capacity": "25 kg",
      "Motor Power": "2.2 kW",
      "Voltage": "380–415V",
      "Speed": "Variable",
      "Bowl Material": "Stainless Steel",
      "Mixer Type": "Spiral",
      "Weight": "180 kg"
    }
  },

  {
    name: "Commercial Food Blender",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-food-blender.jpg",
    specifications: {
      "Container Capacity": "10 L",
      "Motor Power": "2.2 kW",
      "Voltage": "220–240V",
      "Blade Material": "Stainless Steel",
      "Speed": "Variable",
      "Container Material": "Food Grade",
      "Application": "Hotels / Restaurants",
      "Weight": "18 kg"
    }
  },

  {
    name: "Commercial Deep Fryer",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-deep-fryer.jpg",
    specifications: {
      "Oil Capacity": "20 L",
      "Heating Power": "12 kW",
      "Fuel Type": "Electric",
      "Voltage": "380–415V",
      "Tank Material": "Stainless Steel",
      "Temperature": "60–200°C",
      "Control": "Thermostatic",
      "Application": "Restaurant / Hotel"
    }
  },

  {
    name: "Industrial Meat Mincer",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "industrial-meat-mincer.jpg",
    specifications: {
      "Processing Capacity": "300 kg/hour",
      "Motor Power": "2.2 kW",
      "Voltage": "380–415V",
      "Mincer Plate": "8 mm",
      "Body Material": "Stainless Steel",
      "Feed Tray": "Stainless Steel",
      "Application": "Butcheries / Hotels",
      "Weight": "75 kg"
    }
  },

  {
    name: "Commercial Vegetable Cutter",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-vegetable-cutter.jpg",
    specifications: {
      "Processing Capacity": "200 kg/hour",
      "Motor Power": "1.5 kW",
      "Voltage": "220–240V",
      "Cutting Discs": "Multiple Sizes",
      "Body Material": "Stainless Steel",
      "Control": "Push Button",
      "Application": "Commercial Kitchens",
      "Weight": "42 kg"
    }
  },

  {
    name: "Commercial Stainless Steel Work Table",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-stainless-steel-work-table.jpg",
    specifications: {
      "Length": "1,800 mm",
      "Width": "700 mm",
      "Height": "850 mm",
      "Material": "304 Stainless Steel",
      "Top Thickness": "1.5 mm",
      "Shelves": "1 Lower Shelf",
      "Load Capacity": "300 kg",
      "Application": "Commercial Kitchen"
    }
  },

  {
    name: "Commercial Kitchen Exhaust Hood",
    category: "kitchen-equipment",
    categoryName: "Kitchen Equipment",
    image: "commercial-kitchen-exhaust-hood.jpg",
    specifications: {
      "Length": "2,000 mm",
      "Width": "900 mm",
      "Extraction Capacity": "4,000 m³/h",
      "Motor Power": "2.2 kW",
      "Material": "Stainless Steel",
      "Filter Type": "Baffle Filter",
      "Lighting": "LED",
      "Application": "Commercial Kitchen"
    }
  },


  // ==========================================================
  // 12. BATHROOM EQUIPMENT
  // ==========================================================

  {
    name: "Commercial Water Heater",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "commercial-water-heater.jpg",
    specifications: {
      "Capacity": "200 L",
      "Heating Power": "6 kW",
      "Voltage": "380–415V",
      "Temperature Range": "30–80°C",
      "Tank Material": "Stainless Steel",
      "Insulation": "High Density Foam",
      "Safety": "Thermal Protection",
      "Application": "Hotels / Hospitals / Commercial Buildings"
    }
  },

  {
    name: "Instant Electric Water Heater",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "instant-electric-water-heater.jpg",
    specifications: {
      "Power": "8.5 kW",
      "Voltage": "220–240V",
      "Water Flow": "4–6 L/min",
      "Temperature Control": "Digital",
      "Heating Type": "Instant",
      "Protection": "Overheat Protection",
      "Mounting": "Wall Mount",
      "Application": "Bathrooms"
    }
  },

  {
    name: "Commercial Hand Dryer",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "commercial-hand-dryer.jpg",
    specifications: {
      "Motor Power": "1.8 kW",
      "Drying Time": "10–15 Seconds",
      "Voltage": "220–240V",
      "Air Speed": "90 m/s",
      "Material": "Stainless Steel",
      "Activation": "Automatic Sensor",
      "Protection": "IPX1",
      "Application": "Hotels / Offices / Public Facilities"
    }
  },

  {
    name: "Automatic Soap Dispenser",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "automatic-soap-dispenser.jpg",
    specifications: {
      "Capacity": "1,000 ml",
      "Dispensing": "Automatic Sensor",
      "Power": "Battery",
      "Material": "ABS / Stainless Steel",
      "Mounting": "Wall Mount",
      "Sensor Range": "5–10 cm",
      "Refill Type": "Liquid Soap",
      "Application": "Commercial Bathrooms"
    }
  },

  {
    name: "Commercial Bathroom Exhaust Fan",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "commercial-bathroom-exhaust-fan.jpg",
    specifications: {
      "Fan Diameter": "300 mm",
      "Air Flow": "1,200 m³/h",
      "Motor Power": "250 W",
      "Voltage": "220–240V",
      "Speed": "1,400 rpm",
      "Noise Level": "<55 dB",
      "Mounting": "Wall / Ceiling",
      "Application": "Bathrooms / Changing Rooms"
    }
  },

  {
    name: "Commercial Shower System",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "commercial-shower-system.jpg",
    specifications: {
      "Material": "Stainless Steel",
      "Shower Type": "Rain Shower",
      "Water Pressure": "1–5 bar",
      "Connection": "G1/2",
      "Temperature Control": "Thermostatic",
      "Finish": "Chrome",
      "Mounting": "Wall Mount",
      "Application": "Hotels / Guest Houses"
    }
  },

  {
    name: "Commercial Toilet Flush System",
    category: "bathroom-equipment",
    categoryName: "Bathroom Equipment",
    image: "commercial-toilet-flush-system.jpg",
    specifications: {
      "Flush Type": "Automatic Sensor",
      "Flush Volume": "3–6 L",
      "Water Pressure": "0.1–0.8 MPa",
      "Material": "Stainless Steel / ABS",
      "Power": "Battery",
      "Activation": "Infrared Sensor",
      "Installation": "Wall / Toilet Mount",
      "Application": "Commercial Bathrooms"
    }
  },


  // ==========================================================
  // 13. LAUNDRY EQUIPMENT
  // ==========================================================

  {
    name: "Industrial Washing Machine 25kg",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-washing-machine-25kg.jpg",
    specifications: {
      "Washing Capacity": "25 kg",
      "Drum Volume": "250 L",
      "Motor Power": "5.5 kW",
      "Voltage": "380–415V",
      "Spin Speed": "600–900 rpm",
      "Drum Material": "Stainless Steel",
      "Control": "Programmable",
      "Application": "Hotels / Hospitals / Laundries"
    }
  },

  {
    name: "Industrial Washing Machine 50kg",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-washing-machine-50kg.jpg",
    specifications: {
      "Washing Capacity": "50 kg",
      "Drum Volume": "500 L",
      "Motor Power": "11 kW",
      "Voltage": "380–415V",
      "Spin Speed": "500–800 rpm",
      "Drum Material": "Stainless Steel",
      "Control": "PLC Programmable",
      "Application": "Large Commercial Laundries"
    }
  },

  {
    name: "Industrial Tumble Dryer 30kg",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-tumble-dryer-30kg.jpg",
    specifications: {
      "Drying Capacity": "30 kg",
      "Drum Volume": "300 L",
      "Heating Power": "24 kW",
      "Voltage": "380–415V",
      "Drum Speed": "25 rpm",
      "Heating Type": "Electric",
      "Control": "Digital",
      "Application": "Hotels / Hospitals / Laundries"
    }
  },

  {
    name: "Industrial Tumble Dryer 50kg",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-tumble-dryer-50kg.jpg",
    specifications: {
      "Drying Capacity": "50 kg",
      "Drum Volume": "500 L",
      "Heating Power": "36 kW",
      "Voltage": "380–415V",
      "Drum Speed": "25 rpm",
      "Heating Type": "Electric / Gas",
      "Control": "Programmable",
      "Application": "Industrial Laundry"
    }
  },

  {
    name: "Industrial Steam Ironing Table",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-steam-ironing-table.jpg",
    specifications: {
      "Table Size": "1,500 × 500 mm",
      "Steam Pressure": "4 bar",
      "Heating Power": "3 kW",
      "Voltage": "220–240V",
      "Vacuum Motor": "0.75 kW",
      "Surface": "Heat Resistant",
      "Control": "Foot Pedal",
      "Application": "Commercial Laundry"
    }
  },

  {
    name: "Industrial Steam Iron Generator",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-steam-iron-generator.jpg",
    specifications: {
      "Boiler Capacity": "30 L",
      "Steam Pressure": "6 bar",
      "Heating Power": "18 kW",
      "Voltage": "380–415V",
      "Steam Output": "25 kg/hour",
      "Material": "Stainless Steel",
      "Safety": "Pressure Protection",
      "Application": "Hotels / Commercial Laundry"
    }
  },

  {
    name: "Commercial Laundry Press Machine",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "commercial-laundry-press-machine.jpg",
    specifications: {
      "Press Area": "1,200 × 500 mm",
      "Pressing Force": "20 Ton",
      "Heating Power": "9 kW",
      "Voltage": "380–415V",
      "Temperature": "Up to 200°C",
      "Control": "Digital",
      "Surface": "Stainless Steel",
      "Application": "Industrial Laundry"
    }
  },

  {
    name: "Industrial Laundry Folding Machine",
    category: "laundry-equipment",
    categoryName: "Laundry Equipment",
    image: "industrial-laundry-folding-machine.jpg",
    specifications: {
      "Folding Speed": "30 m/min",
      "Maximum Fabric Width": "3,000 mm",
      "Motor Power": "2.2 kW",
      "Voltage": "380–415V",
      "Control": "PLC",
      "Folding Type": "Automatic",
      "Material": "Industrial Steel",
      "Application": "Hotels / Hospitals / Laundries"
    }
  },


  // ==========================================================
  // 14. SAFETY EQUIPMENT
  // ==========================================================

  {
    name: "Industrial Safety Helmet",
    category: "safety-equipment",
    categoryName: "Safety Equipment",
    image: "industrial-safety-helmet.jpg",
    specifications: {
      "Material": "High Density ABS",
      "Standard": "Industrial Safety",
      "Suspension": "Adjustable",
      "Chin Strap": "Included",
      "Ventilation": "Air Vents",
      "Adjustment": "Ratchet",
      "Application": "Construction / Industrial",
      "Weight": "400 g"
    }
  },

  {
    name: "Industrial Safety Goggles",
    category: "safety-equipment",
    categoryName: "Safety Equipment",
    image: "industrial-safety-goggles.jpg",
    specifications: {
      "Lens Material": "Polycarbonate",
      "Lens Type": "Anti-Scratch",
      "UV Protection": "Yes",
      "Frame": "Impact Resistant",
      "Ventilation": "Indirect",
      "Protection": "Dust / Impact",
      "Application": "Workshop / Construction",
      "Weight": "80 g"
    }
  },

  {
    name: "Industrial Safety Gloves",
    category: "safety-equipment",
    categoryName: "Safety Equipment",
    image: "industrial-safety-gloves.jpg",
    specifications: {
      "Material": "Nitrile / Leather",
      "Protection": "Cut / Abrasion",
      "Grip": "High Grip",
      "Size": "M / L / XL",
      "Cuff": "Elastic",
      "Application": "Workshop / Industrial",
      "Water Resistant": "Yes",
      "Type": "Heavy Duty"
    }
  },

  {
    name: "Industrial Safety Boots",
    category: "safety-equipment",
    categoryName: "Safety Equipment",
    image: "industrial-safety-boots.jpg",
    specifications: {
      "Upper Material": "Leather",
      "Toe Cap": "Steel",
      "Sole": "Anti-Slip",
      "Protection": "Impact / Puncture",
      "Sizes": "39–47",
      "Water Resistance": "Yes",
      "Application": "Construction / Industrial",
      "Type": "Heavy Duty"
    }
  },

  {
    name: "Industrial Reflective Safety Vest",
    category: "safety-equipment",
    categoryName: "Safety Equipment",
    image: "industrial-reflective-safety-vest.jpg",
    specifications: {
      "Material": "Polyester",
      "Reflective Strips": "High Visibility",
      "Closure": "Front Zip",
      "Sizes": "M / L / XL / XXL",
      "Visibility": "Day / Night",
      "Application": "Construction / Road Works",
      "Pockets": "Multiple",
      "Type": "High Visibility"
    }
  }

];


// ============================================================
// IMAGE PATH HELPER
// ============================================================

const getImage = (filename) => {

  if (!filename) {
    return "/images/machines/default-machine.jpg";
  }

  return `/images/machines/${filename}`;
};


// ============================================================
// CATEGORY PRICE RANGES
// ============================================================

const priceRanges = {

  "industrial-machinery": [
    45000000,
    250000000
  ],

  "metal-working": [
    1500000,
    85000000
  ],

  "power-tools": [
    250000,
    4500000
  ],

  "compressors": [
    1500000,
    65000000
  ],

  "generators": [
    3500000,
    180000000
  ],

  "hydraulics": [
    350000,
    25000000
  ],

  "construction-equipment": [
    1500000,
    65000000
  ],

  "electrical-equipment": [
    500000,
    35000000
  ],

  "industrial-automation": [
    800000,
    85000000
  ],

  "material-handling": [
    1200000,
    95000000
  ],

  // NEW
  "kitchen-equipment": [
    350000,
    45000000
  ],

  // NEW
  "bathroom-equipment": [
    150000,
    18000000
  ],

  // NEW
  "laundry-equipment": [
    2500000,
    85000000
  ],

  // NEW
  "safety-equipment": [
    25000,
    1500000
  ]
};


// ============================================================
// CATEGORIES WHERE CUSTOMER SHOULD REQUEST A QUOTE
// ============================================================

const quoteCategories = [

  "industrial-machinery",

  "generators",

  "industrial-automation",

  "kitchen-equipment",

  "laundry-equipment"

];


// ============================================================
// GENERATE PRICE
// ============================================================

const generatePrice = (category, index) => {

  const range = priceRanges[category];

  if (!range) {
    return null;
  }

  const [min, max] = range;

  const value =
    min +
    ((max - min) / 11) * index;

  return Math.round(value / 10000) * 10000;
};


// ============================================================
// DISPLAY PRICE
// ============================================================

const getPriceDisplay = (category, price) => {

  if (quoteCategories.includes(category)) {
    return "Request Quote";
  }

  if (
    price === null ||
    price === undefined
  ) {
    return "Request Quote";
  }

  return `UGX ${price.toLocaleString("en-UG")}`;
};


// ============================================================
// CREATE FINAL PRODUCTS
// ============================================================

const products = productDefinitions.map(
  (product, index) => {

    const productNumber = index + 1;

    const price = generatePrice(
      product.category,
      index % 12
    );

    const slug = product.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const imagePath = getImage(
      product.image
    );

    const isQuoteCategory =
      quoteCategories.includes(
        product.category
      );

    return {

      // ------------------------------------------------------
      // ID
      // ------------------------------------------------------

      id: productNumber,


      // ------------------------------------------------------
      // URL SLUG
      // ------------------------------------------------------

      slug: `${slug}-${productNumber}`,


      // ------------------------------------------------------
      // PRODUCT INFORMATION
      // ------------------------------------------------------

      name: product.name,

      brand: "Apex Machinery",

      category: product.category,

      categoryName: product.categoryName,


      // ------------------------------------------------------
      // PRICING
      // ------------------------------------------------------

      price,

      currency: "UGX",

      priceDisplay:
        getPriceDisplay(
          product.category,
          price
        ),


      // ------------------------------------------------------
      // PRODUCT STATUS
      // ------------------------------------------------------

      stock:
        isQuoteCategory
          ? 0
          : 3 + ((productNumber * 7) % 25),

      status:
        isQuoteCategory
          ? "Available on Order"
          : "In Stock",


      // ------------------------------------------------------
      // RATINGS
      // ------------------------------------------------------

      rating:
        Number(
          (
            4.2 +
            ((productNumber % 8) / 10)
          ).toFixed(1)
        ),

      reviewCount:
        8 +
        ((productNumber * 17) % 150),


      // ------------------------------------------------------
      // DESCRIPTION
      // ------------------------------------------------------

      description:
        `${product.name} is a professional-grade ${product.categoryName.toLowerCase()} solution supplied by Apex Machinery. It is designed for demanding workshop, construction, manufacturing, hospitality, hotel, commercial, engineering and industrial applications. Contact Apex Machinery for availability, installation requirements, delivery and technical support.`,


      // ------------------------------------------------------
      // IMAGE
      // ------------------------------------------------------

      image: imagePath,

      images: [
        imagePath
      ],


      // ------------------------------------------------------
      // SPECIFICATIONS
      // ------------------------------------------------------

      specifications: {

        Brand: "Apex Machinery",

        "Product Category":
          product.categoryName,

        ...product.specifications,

        Warranty: "12 Months",

        "Technical Support":
          "Available"
      },


      // ------------------------------------------------------
      // BADGES
      // ------------------------------------------------------

      badges: [

        product.categoryName,

        "Professional Grade"

      ]

    };
  }
);


// ============================================================
// HELPER FUNCTIONS
// ============================================================


// ------------------------------------------------------------
// GET PRODUCT BY ID
// ------------------------------------------------------------

export function getProductById(id) {

  return products.find(
    (product) =>
      String(product.id) === String(id)
  );

}


// ------------------------------------------------------------
// GET PRODUCTS BY CATEGORY
// ------------------------------------------------------------

export function getProductsByCategory(
  categoryId
) {

  return products.filter(
    (product) =>
      product.category === categoryId
  );

}


// ------------------------------------------------------------
// GET RELATED PRODUCTS
// ------------------------------------------------------------

export function getRelatedProducts(
  product,
  count = 4
) {

  return products

    .filter(
      (item) =>
        item.category === product.category &&
        item.id !== product.id
    )

    .slice(0, count);

}


// ------------------------------------------------------------
// GET FEATURED PRODUCTS
// ------------------------------------------------------------

export function getFeaturedProducts(
  count = 8
) {

  return [...products]

    .sort(
      (a, b) =>
        b.rating - a.rating
    )

    .slice(0, count);

}


// ------------------------------------------------------------
// SEARCH PRODUCTS
// ------------------------------------------------------------

export function searchProducts(query) {

  const q =
    String(query || "")
      .trim()
      .toLowerCase();

  if (!q) {
    return [];
  }

  return products.filter(
    (product) =>

      product.name
        .toLowerCase()
        .includes(q) ||

      product.brand
        .toLowerCase()
        .includes(q) ||

      product.categoryName
        .toLowerCase()
        .includes(q) ||

      product.description
        .toLowerCase()
        .includes(q)

  );

}


// ============================================================
// GET PRODUCTS BY BRAND
// ============================================================

export function getProductsByBrand(
  brand
) {

  const selectedBrand =
    String(brand || "")
      .trim()
      .toLowerCase();

  if (!selectedBrand) {
    return [];
  }

  return products.filter(
    (product) =>
      product.brand
        .toLowerCase() === selectedBrand
  );

}


// ============================================================
// GET PRODUCTS BY STOCK STATUS
// ============================================================

export function getProductsByStatus(
  status
) {

  const selectedStatus =
    String(status || "")
      .trim()
      .toLowerCase();

  if (!selectedStatus) {
    return [];
  }

  return products.filter(
    (product) =>
      product.status
        .toLowerCase() === selectedStatus
  );

}


// ============================================================
// GET PRODUCTS BY PRICE RANGE
// ============================================================

export function getProductsByPriceRange(
  minPrice,
  maxPrice
) {

  return products.filter(
    (product) => {

      if (
        product.price === null ||
        product.price === undefined
      ) {
        return false;
      }

      return (
        product.price >= minPrice &&
        product.price <= maxPrice
      );

    }
  );

}


// ============================================================
// GET PRODUCT COUNT
// ============================================================

export function getProductCount() {

  return products.length;

}


// ============================================================
// GET CATEGORY COUNT
// ============================================================

export function getCategoryCount(
  categoryId
) {

  return products.filter(
    (product) =>
      product.category === categoryId
  ).length;

}


// ============================================================
// GET ALL CATEGORIES
// ============================================================

export function getCategories() {

  const categories = [];

  products.forEach(
    (product) => {

      const exists =
        categories.some(
          (category) =>
            category.id === product.category
        );

      if (!exists) {

        categories.push({

          id: product.category,

          name: product.categoryName,

          count:
            products.filter(
              (item) =>
                item.category ===
                product.category
            ).length

        });

      }

    }
  );

  return categories;

}


// ============================================================
// EXPORTS
// ============================================================

export {

  products,

  productDefinitions,

  priceRanges,

  quoteCategories,

  getImage,

  getPriceDisplay

};

export default products;