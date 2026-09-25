"use client";

export interface BodyRegion {
  id: string;
  label: string;
  percentage: number;
}

interface BurnBodyMapProps {
  regions: BodyRegion[];
  selected: Set<string>;
  onToggle: (id: string) => void;
}

export default function BurnBodyMap({
  regions,
  selected,
  onToggle,
}: BurnBodyMapProps) {
  // Region percentages map for easy lookup
  const regionPercents: Record<string, number> = {};
  regions.forEach(r => {
    regionPercents[r.id] = r.percentage;
  });

  const regionCentroids: Record<string, { x: number, y: number }> = {
    "f_head": { "x": 1875, "y": 625 },
    "f_neck": { "x": 1828, "y": 1234 },
    "f_arm_L": { "x": 923, "y": 2150 },
    "f_arm_R": { "x": 2833, "y": 2121 },
    "f_forearm_L": { "x": 806, "y": 3187 },
    "f_forearm_R": { "x": 2951, "y": 3187 },
    "f_hand_L": { "x": 371, "y": 3990 },
    "f_hand_R": { "x": 3388, "y": 3989 },
    "f_torso": { "x": 1872, "y": 2445 },
    "f_genital": { "x": 1900, "y": 3898 },
    "f_thigh_L": { "x": 1468, "y": 4516 },
    "f_thigh_R": { "x": 2307, "y": 4591 },
    "f_leg_L": { "x": 1477, "y": 6109 },
    "f_leg_R": { "x": 2273, "y": 6202 },
    "f_foot_L": { "x": 1421, "y": 7264 },
    "f_foot_R": { "x": 2311, "y": 7260 },
    "b_head": { "x": 6103, "y": 631 },
    "b_neck": { "x": 6110, "y": 1165 },
    "b_arm_L": { "x": 5086, "y": 2158 },
    "b_arm_R": { "x": 7097, "y": 2160 },
    "b_forearm_L": { "x": 4982, "y": 3186 },
    "b_forearm_R": { "x": 7186, "y": 3188 },
    "b_hand_L": { "x": 4543, "y": 3989 },
    "b_hand_R": { "x": 7629, "y": 3990 },
    "b_torso": { "x": 6091, "y": 2200 },
    "b_buttock_L": { "x": 5733, "y": 3613 },
    "b_buttock_R": { "x": 6466, "y": 3611 },
    "b_thigh_L": { "x": 5696, "y": 4703 },
    "b_thigh_R": { "x": 6509, "y": 4925 },
    "b_leg_L": { "x": 5687, "y": 6013 },
    "b_leg_R": { "x": 6481, "y": 6399 },
    "b_foot_L": { "x": 5673, "y": 7246 },
    "b_foot_R": { "x": 6487, "y": 7288 }
  };


  return (
    <div className="relative w-full rounded-xl overflow-hidden glass-card p-2" style={{ borderColor: "var(--glass-border)" }}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8000 7652" className="w-full h-auto block select-none">
        
        <g id="regions">
          {/* f_head */}
          <polygon id="f_head" onClick={() => onToggle("f_head")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_head") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1791,145 1623,216 1551,287 1508,358 1487,430 1480,501 1481,572 1431,643 1427,714 1453,785 1492,857 1550,928 1569,999 1573,1070 2178,1070 2180,999 2199,928 2255,857 2292,785 2322,714 2321,643 2265,572 2268,501 2261,430 2241,358 2204,287 2136,216 1970,145">
            
          </polygon>
          
          {/* f_neck */}
          <polygon id="f_neck" onClick={() => onToggle("f_neck")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_neck") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1430,1080 2320,1080 2170,1300 2000,1400 1800,1460 1600,1400 1430,1300">
            
          </polygon>

          {/* f_arm_L */}
          <polygon id="f_arm_L" onClick={() => onToggle("f_arm_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_arm_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1077,1310 1077,1415 854,1521 754,1626 714,1732 693,1837 690,1942 696,2048 683,2153 663,2258 652,2364 643,2469 633,2575 609,2680 1203.6,2695.3 1189.3,2591.1 1173.4,2478.6 1165.2,2366.7 1165.2,2254.3 1170.5,2142.4 1174.5,2030.5 1169.3,1918.1 1160,1837 1144.1,1753.7 1114.3,1641.3 854,1521 1150.9,1416.9 1156,1305">
            
          </polygon>

          {/* f_arm_R */}
          <polygon id="f_arm_R" onClick={() => onToggle("f_arm_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_arm_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2435.7,1306.7 2657.6,1416.9 2684.1,1529.3 2646,1641.3 2617.7,1753.7 2601,1837 2591,1918.1 2583,2030.5 2576.6,2142.4 2591.5,2254.3 2591.7,2366.7 2579.5,2478.6 2561.7,2591.1 2547.6,2695.3 3156,2680 3126,2575 3116,2469 3108,2364 3097,2258 3077,2153 3062,2048 3071,1942 3070,1837 3054,1732 3016,1626 2945,1521 2762,1415 2435.7,1306.7">
            
          </polygon>

          {/* f_forearm_L */}
          <polygon id="f_forearm_L" onClick={() => onToggle("f_forearm_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_forearm_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="609,2680 574,2755 537,2829 504,2904 477,2978 457,3053 441,3128 428,3202 415,3277 403,3352 389,3426 371,3501 350,3575 305.5,3655 1114,3650 1127,3575 1140,3501 1154,3426 1158.4,3330.7 1171,3277 1174.1,3201.6 1181.8,3105.2 1188,3053 1199,2970.8 1208,2904 1212.5,2836.9 1210,2755 1203.6,2695.3">
            
          </polygon>

          {/* f_forearm_R */}
          <polygon id="f_forearm_R" onClick={() => onToggle("f_forearm_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_forearm_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2547.6,2695.3 2542,2755 2538.5,2836.9 2543,2904 2551.1,2970.8 2562.6,3067.7 2569,3128 2573,3201.6 2587.4,3317.2 2587.4,3317.2 2594,3426 2607,3501 2621,3575 2634,3650 3463,3655 3414,3575 3393,3501 3377,3426 3362,3352 3349,3277 3336,3202 3321,3128 3305,3053 3284,2978 3258,2904 3226,2829 3189,2755 3156,2680">
            
          </polygon>

          {/* f_hand_L */}
          <polygon id="f_hand_L" onClick={() => onToggle("f_hand_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_hand_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="305.5,3655 216,3717 156,3774 117,3831 80,3888 36,3945 1,4002 181,4058 174,4115 167,4172 163,4229 165,4286 247,4343 247,4400 433,4400 433,4343 529,4286 550,4229 564,4172 578,4115 596,4058 617,4002 636,3945 649,3888 654,3831 652,3774 651,3717 675,3660">
            
          </polygon>

          {/* f_hand_R */}
          <polygon id="f_hand_R" onClick={() => onToggle("f_hand_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_hand_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="3085,3660 3110,3717 3108,3774 3108,3831 3113,3888 3126,3945 3144,4002 3162,4058 3180,4115 3193,4172 3206,4229 3228,4286 3324,4343 3324,4400 3506,4400 3506,4343 3590,4286 3594,4229 3589,4172 3582,4115 3575,4058 3748,4002 3723,3945 3678,3888 3642,3831 3607,3774 3551,3717 3463,3655">
            
          </polygon>

          {/* f_torso */}
          <polygon id="f_torso" onClick={() => onToggle("f_torso")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_torso") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1430,1300 1156,1305 1150.9,1416.9 909.7,1537.6 1114.3,1641.3 1144.1,1753.7 1169.3,1918.1 1174.5,2030.5 1170.5,2142.4 1165.2,2254.3 1165.2,2366.7 1173.4,2478.6 1189.3,2591.1 1203.6,2695.3 1212.5,2836.9 1199,2970.8 1181.8,3105.2 1174.1,3201.6 1158.4,3330.7 1158.4,3330.7 1550,3760 1900,3650 2250,3760 2587.4,3317.2 2587.4,3317.2 2573,3201.6 2562.6,3067.7 2551.1,2970.8 2538.5,2836.9 2547.6,2695.3 2561.7,2591.1 2579.5,2478.6 2591.7,2366.7 2591.5,2254.3 2576.6,2142.4 2583,2030.5 2591,1918.1 2617.7,1753.7 2646,1641.3 2684.1,1529.3 2657.6,1416.9 2435.7,1306.7 2170,1300">
            
          </polygon>

          {/* f_genital */}
          <polygon id="f_genital" onClick={() => onToggle("f_genital")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_genital") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2230,3900 2212.1,4007.2 2160.4,4102.7 2080.5,4176.3 1981,4219.9 1877.9,4210.5 1767.4,4202.2 1676.5,4142.8 1609.8,4057.1 1574.5,3954.3 1574.5,3845.7 1609.8,3742.9 1676.5,3657.2 1767.4,3597.8 1872.7,3571.1 1981,3580.1 2080.5,3623.7 2160.4,3697.3 2212.1,3792.8 2230,3900">
            
          </polygon>

          {/* f_thigh_L */}
          <polygon id="f_thigh_L" onClick={() => onToggle("f_thigh_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_thigh_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1073,3780 1059,3917 1053,4055 1055,4192 1062,4329 1074,4466 1090,4604 1113,4741 1141,4878 1173,5015 1203,5153 1228.3,5303.3 1781,5290 1797,5153 1812,5015 1826,4878 1899.5,4741 1899.5,4604 1898,4466 1890,4329 1877.9,4210.5 1666,4055 1838,3917 1685,3780">
            
          </polygon>

          {/* f_thigh_R */}
          <polygon id="f_thigh_R" onClick={() => onToggle("f_thigh_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_thigh_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2066,3780 1951,3917 2084,4055 2682.5,4192 2674.5,4329 2062,4466 1899.5,4604 1899.5,4741 1910,4878 1925,5015 1941,5153 1958,5290 2518,5303.3 2543,5153 2573,5015 2606,4878 2634,4741 2657,4604 2674,4466 2674.5,4329 2682.5,4192 2695,4055 2689,3917 2676,3780">
            
          </polygon>

          {/* f_leg_L */}
          <polygon id="f_leg_L" onClick={() => onToggle("f_leg_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_leg_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1228.3,5303.3 1223,5447 1210,5585 1205.5,5722 1200,5859 1202,5996 1247,6134 1278,6271 1322,6408 1363,6545 1396,6683 1395.7,6833.3 1749,6820 1735,6683 1732,6545 1748,6408 1749,6271 1247,6134 1618,5996 1200,5859 1205.5,5722 1749,5585 1749,5447 1228.3,5303.3">
            
          </polygon>

          {/* f_leg_R */}
          <polygon id="f_leg_R" onClick={() => onToggle("f_leg_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_leg_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2518,5303.3 2000,5447 2523.5,5585 2540,5722 2545,5859 2157,5996 2496,6134 2453,6271 2000,6408 2006,6545 2005,6683 2000,6820 2343.3,6833.3 2343,6683 2378,6545 2421,6408 2453,6271 2496,6134 2543,5996 2545,5859 2540,5722 2523.5,5585 2523,5447 2518,5303.3">
            
          </polygon>

          {/* f_foot_L */}
          <polygon id="f_foot_L" onClick={() => onToggle("f_foot_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_foot_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="1395.7,6833.3 1404,6898 1386,6955 1357,7013 1326.5,7071 1284,7129 1258,7186 1247,7244 1224,7302 1260,7360 1377,7417 1377,7475 1561,7475 1561,7417 1572,7360 1317,7302 1247,7244 1649,7186 1649,7129 1326.5,7071 1357,7013 1386,6955 1404,6898 1395.7,6833.3">
            
          </polygon>

          {/* f_foot_R */}
          <polygon id="f_foot_R" onClick={() => onToggle("f_foot_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("f_foot_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="2343.3,6833.3 2335,6898 2354,6955 2382.5,7013 2413,7071 2062,7129 2057,7186 2489.5,7244 2421,7302 2166,7360 2177,7417 2177,7475 2363,7475 2363,7417 2486,7360 2513,7302 2489.5,7244 2480,7186 2455,7129 2413,7071 2382.5,7013 2354,6955 2335,6898 2343.3,6833.3">
            
          </polygon>

          {/* b_head */}
          <polygon id="b_head" onClick={() => onToggle("b_head")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_head") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6037,145 5857,217 5782,288 5740,360 5720,431 5715,503 5717,574 5660,646 5665,717 5691,789 5719,860 5752,932 5771,1003 5767,1075 6429,1075 6426,1003 6438,932 6471,860 6501,789 6530,717 6540,646 6490,574 6498,503 6497,431 6481,360 6446,288 6377,217 6203,145">
            
          </polygon>

          {/* b_neck */}
          <polygon id="b_neck" onClick={() => onToggle("b_neck")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_neck") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5665,1080 6535,1080 6350,1235 6195,1290 6055,1290 5885,1235 5665,1080">
            
          </polygon>

          {/* b_arm_L */}
          <polygon id="b_arm_L" onClick={() => onToggle("b_arm_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_arm_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5537,1303.3 5249,1415 5050.2,1517.3 4935,1626 4892,1732 4871,1837 4868,1942 4869,2048 4852,2153 4831,2258 4818,2364 4809,2469 4798,2575 4772,2680 5377.3,2693.3 5356.7,2592.5 5335.1,2484.5 5318,2377 5304.4,2269 5303.9,2161.5 5317.2,2054 5321.9,1946 5317.1,1838.5 5300.8,1731 5269.6,1623 5050.2,1517.3 5343.5,1407.5 5537,1303.3">
            
          </polygon>

          {/* b_arm_R */}
          <polygon id="b_arm_R" onClick={() => onToggle("b_arm_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_arm_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6663.7,1303.3 6856.5,1407.5 7144.7,1517.3 6928.3,1623 6895.3,1731 6877.9,1838.5 6866.9,1946 6865.5,2054 6873.9,2161.5 6870.6,2269 6856,2377 6838.8,2484.5 6816,2592.5 6793.3,2693.3 7408,2680 7380,2575 7368,2469 7359,2364 7347,2258 7327,2153 7314,2048 7324,1942 7321,1837 7299,1732 7256,1626 7144.7,1517.3 6956,1415 6663.7,1303.3">
            
          </polygon>

          {/* b_forearm_L */}
          <polygon id="b_forearm_L" onClick={() => onToggle("b_forearm_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_forearm_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="4772,2680 4737,2755 4701,2829 4667,2904 4640,2978 4619,3053 4603,3128 4589,3202 4577,3277 4564,3352 4550,3426 4534,3501 4514,3575 4465.5,3655 5294,3650 5307,3575 5320,3501 5333,3426 5345,3352 5390,3277 5381,3166.7 5381,3166.7 5381.2,3051.5 5390.3,2959 5394,2904 5395,2829.5 5388,2755 5377.3,2693.3">
            
          </polygon>

          {/* b_forearm_R */}
          <polygon id="b_forearm_R" onClick={() => onToggle("b_forearm_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_forearm_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6793.3,2693.3 6781,2755 6770,2829.5 6769.5,2922 6771,2978 6776.9,3051.5 6805.2,3153.6 6787,3202 6773,3277 6803,3352 6812,3426 6823,3501 6836,3575 6848,3650 7705,3655 7662,3575 7643,3501 7626,3426 7613,3352 7600,3277 7588,3202 7574,3128 7558,3053 7537,2978 7510,2904 7477,2829 7442,2755 7408,2680">
            
          </polygon>

          {/* b_hand_L */}
          <polygon id="b_hand_L" onClick={() => onToggle("b_hand_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_hand_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="4465.5,3655 4378,3717 4321,3774 4284,3831 4248,3888 4225,3945 4278,4002 4352,4058 4344,4115 4338,4172 4334,4229 4338,4286 4418,4343 4418,4400 4598,4400 4598,4343 4697,4286 4717,4229 4731,4172 4745,4115 4762,4058 4781,4002 4798,3945 4809,3888 4812,3831 4811,3774 4810,3717 4836,3660">
            
          </polygon>

          {/* b_hand_R */}
          <polygon id="b_hand_R" onClick={() => onToggle("b_hand_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_hand_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="7335,3660 7357,3717 7357,3774 7357,3831 7361,3888 7373,3945 7391,4002 7410,4058 7427,4115 7441,4172 7454,4229 7473,4286 7570,4343 7570,4400 7757,4400 7757,4343 7840,4286 7842,4229 7837,4172 7830,4115 7824,4058 7888,4002 7967,3945 7924,3888 7888,3831 7852,3774 7793,3717 7705,3655">
            
          </polygon>

          {/* b_torso */}
          <polygon id="b_torso" onClick={() => onToggle("b_torso")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_torso") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5665,1080 5537,1303.3 5343.5,1407.5 5050.2,1517.3 5269.6,1623 5300.8,1731 5317.1,1838.5 5321.9,1946 5317.2,2054 5303.9,2161.5 5304.4,2269 5318,2377 5335.1,2484.5 5356.7,2592.5 5377.3,2693.3 5395,2829.5 5390.3,2959 5381.2,3051.5 5381,3166.7 5381,3166.7 5725,3330 6100,3400 6475,3330 6805.2,3153.6 6805.2,3153.6 6776.9,3051.5 6769.5,2922 6770,2829.5 6793.3,2693.3 6816,2592.5 6838.8,2484.5 6856,2377 6870.6,2269 6873.9,2161.5 6865.5,2054 6866.9,1946 6877.9,1838.5 6895.3,1731 6928.3,1623 7144.7,1517.3 6856.5,1407.5 6663.7,1303.3 6535,1080">
            
          </polygon>

          {/* b_buttock_L */}
          <polygon id="b_buttock_L" onClick={() => onToggle("b_buttock_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_buttock_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5381,3166.7 6100,3160 6100,4130 5750,4080 5300,3900 5300,3780 5381,3166.7">
            
          </polygon>

          {/* b_buttock_R */}
          <polygon id="b_buttock_R" onClick={() => onToggle("b_buttock_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_buttock_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6805.2,3153.6 6100,3160 6100,4130 6440,4080 6900,3900 6900,3780 6805.2,3153.6">
            
          </polygon>

          {/* b_thigh_L */}
          <polygon id="b_thigh_L" onClick={() => onToggle("b_thigh_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_thigh_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5233,4180 5241,4281 5251,4382 5263,4483 5279,4584 5296,4685 5315,4785 5336,4886 5360,4987 5385,5088 5404,5189 5415.5,5300 5965,5300 5981,5189 5995,5088 6124.5,4987 6124.5,4886 6124,4785 6113,4685 6104,4584 6096,4483 6090,4382 6086,4281 6086,4180">
            
          </polygon>

          {/* b_thigh_R */}
          <polygon id="b_thigh_R" onClick={() => onToggle("b_thigh_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_thigh_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6890,4180 6882,4281 6871.5,4382 6267,4483 6560,4584 6825.5,4685 6805.5,4785 6124.5,4886 6124.5,4987 6135,5088 6149,5189 6164,5290 6704,5303.3 6724,5189 6743,5088 6768,4987 6794,4886 6805.5,4785 6825.5,4685 6855,4584 6870,4483 6871.5,4382 6882,4281 6890,4180">
            
          </polygon>

          {/* b_leg_L */}
          <polygon id="b_leg_L" onClick={() => onToggle("b_leg_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_leg_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5415.5,5300 5415,5447 5397,5585 5378,5722 5383.5,5859 5388,5996 5423,6134 5468,6271 5513,6408 5558,6545 5595,6683 5593,6830 5974,6820 5924,6683 5923,6545 5938,6408 5958,6271 5974,6134 5807,5996 5383.5,5859 5974,5722 5960,5585 5947,5447 5965,5300">
            
          </polygon>

          {/* b_leg_R */}
          <polygon id="b_leg_R" onClick={() => onToggle("b_leg_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_leg_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6704,5303.3 6698.5,5447 6715.5,5585 6733.5,5722 6738.5,5859 6352,5996 6687.5,6134 6642.5,6271 6596,6408 6225,6545 6225,6683 6453,6830 6525.5,6830 6527,6683 6564,6545 6596,6408 6642.5,6271 6687.5,6134 6735,5996 6738.5,5859 6733.5,5722 6715.5,5585 6698.5,5447 6704,5303.3">
            
          </polygon>

          {/* b_foot_L */}
          <polygon id="b_foot_L" onClick={() => onToggle("b_foot_L")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_foot_L") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="5593,6830 5614.5,6900 5587.5,6960 5561,7020 5521,7080 5521,7140 5417,7200 5463,7260 5691,7320 5508,7380 5563,7440 5729,7500 5830,7500 5874,7440 5874,7380 5691,7320 5835,7260 5771,7200 5871,7140 5871,7080 5561,7020 5587.5,6960 5614.5,6900 5659,6840">
            
          </polygon>

          {/* b_foot_R */}
          <polygon id="b_foot_R" onClick={() => onToggle("b_foot_R")} className={`cursor-pointer transition-all duration-150 ${selected.has("b_foot_R") ? "fill-red-500/40 stroke-red-400 stroke-[10]" : "fill-transparent hover:fill-orange-500/30 stroke-white/30 stroke-[15] hover:stroke-orange-400/80 hover:stroke-[10]"}`} points="6453,6830 6504.5,6900 6534.5,6960 6563,7020 6591.5,7080 6591.5,7140 6290,7200 6336,7260 6567.5,7320 6525,7380 6275,7440 6297,7500 6398,7500 6556,7440 6611,7380 6567.5,7320 6713,7260 6648,7200 6591.5,7140 6591.5,7080 6563,7020 6534.5,6960 6504.5,6900 6525.5,6830" />
        </g>

        <g id="dynamic-labels" pointerEvents="none">
          {regions.map((r) => {
            const c = regionCentroids[r.id];
            if (!c) return null;
            return (
              <g key={`label-${r.id}`}>
                <rect x={c.x - 220} y={c.y - 110} width={440} height={220} rx={110} fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.3)" strokeWidth="15" style={{ backdropFilter: "blur(4px)" }} />
                <text x={c.x} y={c.y + 10} textAnchor="middle" dominantBaseline="middle" fontSize={160} fontWeight="900" fill="#f8fafc" letterSpacing="-2">
                  %{r.percentage}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}