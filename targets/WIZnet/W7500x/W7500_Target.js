/******************************************************************************
  Target Script for STM32

  Copyright (c) 2008, 2010, 2011, 2012 Rowley Associates Limited.

  This file may be distributed under the terms of the License Agreement
  provided with this software.

  THIS FILE IS PROVIDED AS IS WITH NO WARRANTY OF ANY KIND, INCLUDING THE
  WARRANTY OF DESIGN, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE.
 ******************************************************************************/

function EnableTrace(TraceInterfaceType)
{

}

function Reset()
{   
	TargetInterface.pokeWord(0xE000EDF0, 0xA05F0003); // set C_HALT and C_DEBUGEN in DHCSR      
	TargetInterface.waitForDebugState(1000);

	var CPUID = TargetInterface.peekWord(0xE000ED00);
	if (((CPUID>>4)&0xf)==0) // Cortex-M0
	{
		TargetInterface.pokeWord(0xE000EDFC, 0x1); // set VC_CORERESET in DEMCR
		TargetInterface.pokeWord(0xE000ED0C, 0x05FA0004); // set SYSRESETREQ in AIRCR
		TargetInterface.waitForDebugState(1000);
	}
}

function SRAMReset()
{
	if (TargetInterface.implementation() == "j-link" || TargetInterface.implementation() == "crossworks_simulator")
		TargetInterface.resetAndStop(100);
	else
		Reset();
}

function FLASHReset()
{
	if (TargetInterface.implementation() == "j-link" || TargetInterface.implementation() == "crossworks_simulator")
		TargetInterface.resetAndStop(100);
	else
		Reset();
}

function GetPartName()
{
	var target = TargetInterface.getProjectProperty("Target");
	var CPUID = TargetInterface.peekWord(0xE000ED00);

	return "W7500";

	if (((CPUID>>4)&0xf)==0) // Cortex-M0
	{
		// 실질적으로 MCU의 ID를 읽어와서 ID가 일치할 경우 "W7500"을 리턴하도록 수정해야 함.
		return "W7500";

		//switch ((TargetInterface.peekWord(0x40015800) & 0xfff))
		//{
		//case 0x457:
		//case 0x425:
		//case 0x417:
		//case 0x447:
		//	return "STM32L0x1/STM32L0x2/STM32L0x3";
		//case 0x440:
		//	return "STM32F05x/STM32F030x8";
		//case 0x442:
		//	return "STM32F09x/STM32F030xC";
		//case 0x443:
		//	return "STM32C011xx";
		//case 0x444:
		//	return "STM32F03x/STM32F030x4/STM32F030x6";
		//case 0x445:
		//	return "STM32F04x/STM32F070x6";
		//case 0x448:
		//	return "STM32F07x/STM32F070xB";
		//case 0x453:
		//	return "STM32C031xx";
		//case 0x456:
		//	return "STM32G050xx/STM32G051xx/STM32G061xx";
		//case 0x460:
		//	return "STM32G070xx/STM32G071xx/STM32G081xx";
		//case 0x466:
		//	return "STM32G030xx/STM32G031xx/STM32G041xx";
		//case 0x467:
		//	return "STM32G0B0xx/STM32G0B1xx/STM32G0C1xx";
		//default: // The ROM table may not be visible
		//	TargetInterface.setDebugInterfaceProperty("component_base", 0xe000e000);
		//	TargetInterface.setDebugInterfaceProperty("component_base", 0xe0001000);
		//	TargetInterface.setDebugInterfaceProperty("component_base", 0xe0002000);
		//break;
		//}
	}
}

function MatchPartName(name)
{
	var family = name.substring(0, 9); // STM32F100, STM32F102, STM32F101, STM32F103, STM32F105, STM32F107, STM32F205, STM32F207, STM32F405, STM32F407, STM32L151, STM32L152, STM32F051, STM32F050, STM32F427, STM32F437
	var density = name.substring(10, 11); // 4==16K, 6==32K, 8==64K, B=128K, C=256K, D=384K, E=512K, F=768K, G=1024K, I=2048K
	var CPUID = TargetInterface.peekWord(0xE000ED00);

	// 실질적으로 MCU의 ID를 읽어와서 ID가 일치할 경우 true를 리턴하도록 수정해야 함.
	return (family=="W7500");

  //if (((CPUID>>4)&0xf)==0) // Cortex-M0
  //  switch ((TargetInterface.peekWord(0x40015800) & 0xfff))
  //    {
  //      case 0x457:
  //      case 0x425:
  //      case 0x417:
  //      case 0x447:
  //        return (family=="STM32L010") || (family=="STM32L011") || (family=="STM32L031") || (family=="STM32L041") || (family=="STM32L051") || (family=="STM32L052") || (family=="STM32L053") || (family=="STM32L061") || (family=="STM32L062") || (family=="STM32L063") || (family=="STM32L071") || (family=="STM32L072") || (family=="STM32L073") || (family=="STM32L083");
  //      case 0x440:
  //        return (family=="STM32F058") || (family=="STM32F051") || ((family=="STM32F030") && (density=="8"));
  //      case 0x442:
  //        return (family=="STM32F091") || (family=="STM32F098") || ((family=="STM32F030") && (density=="C"));
  //      case 0x443:
  //        return (family=="STM32C011");
  //      case 0x444:
  //        return (family=="STM32F031") || (family=="STM32F038") || ((family=="STM32F030") && (density=="4" || density=="6"));
  //      case 0x445:
  //        return (family=="STM32F042") || (family=="STM32F048") || ((family=="STM32F070") && (density=="6"));
  //      case 0x448:
  //        return (family=="STM32F070") || (family=="STM32F071") || (family=="STM32F072") || (family=="STM32F078") || ((family=="STM32F070") && (density=="B"));
  //      case 0x453:
  //        return (family=="STM32C031");
  //      case 0x456:
  //        return (family=="STM32G050") || (family=="STM32G051") || (family=="STM32F061");
  //      case 0x460:
  //        return (family=="STM32G070") || (family=="STM32G071") || (family=="STM32F081");
  //      case 0x466:
  //        return (family=="STM32G030") || (family=="STM32G031") || (family=="STM32F041");
  //      case 0x467:
  //        return (family=="STM32G0B0") || (family=="STM32G0B1") || (family=="STM32F0C1");
  //    }
  //else if (((CPUID>>4)&0xfff)==0xD21) // Cortex-M33
  //  switch ((TargetInterface.peekWord(0xE0044000) & 0xfff))
  //    {
  //      case 0x455:
  //        return (family == "STM32U535") || (family == "STM32U545");
  //      case 0x472:
  //        return (family == "STM32L552") || (family == "STM32L562");
  //      case 0x481:
  //        return (family == "STM32U595") || (family == "STM32U599") || (family == "STM32U5A5") || (family == "STM32U5A9");
  //      case 0x482:
  //        return (family == "STM32U575") || (family == "STM32U585");
  //      case 0x474:
  //        return (family == "STM32H503");
  //      case 0x484:
  //        return (family == "STM32H563") || (family == "STM32H573") || (family == "STM32H562");
  //      case 0x492:
  //        return (family == "STM32WBA5");
  //    }
  //else
  //  switch ((TargetInterface.peekWord(0xE0042000) & 0xfff))
  //    {
  //      case 0x420: // low and medium density value 
  //        return (family=="STM32F100") && (density=="4" || density=="6" || density=="8" || density=="B");
  //      case 0x428: // high density value
  //        return  (family=="STM32F100") && (density=="C" || density=="D" || density=="E");
  //      case 0x412: // low density
  //        return (family=="STM32F101" || family=="STM32F102" || family=="STM32F103") && (density=="4" || density=="6");
  //      case 0x410: // medium density   
  //        return (family=="STM32F101" || family=="STM32F102" || family=="STM32F103") && (density =="8" || density=="B");
  //      case 0x414: // high density
  //        return (family=="STM32F101" || family=="STM32F102" || family=="STM32F103") && (density =="C" || density=="D" || density=="E");
  //      case 0x430: // xl density
  //        return (family=="STM32F101" || family=="STM32F103") && (density =="F" || density=="G");
  //      case 0x418: // connectivity
  //        return (family=="STM32F105" || family=="STM32F107");
  //      case 0x411: // STM32F2xx/F4xx
  //        return (family=="STM32F205" || family=="STM32F207" || family=="STM32F215" || family=="STM32F217" || family == "STM32F405" || family == "STM32F407" || family == "STM32F415" || family == "STM32F417");
  //      case 0x413: // STM32F4xx
  //        return (family == "STM32F405" || family == "STM32F407" || family == "STM32F415" || family == "STM32F417");
  //      case 0x415: // STM32L4x6
  //        return (family == "STM32L476" || family == "STM32L486" || family == "STM32L471" || family == "STM32L475");
  //      case 0x416: // low and medium density STM32L
  //      case 0x429:
  //        return (family=="STM32L151" || family=="STM32L152" || family=="STM32L100") && (density=="6" || density=="8" || density=="B");
  //      case 0x419: // STM32F427x/STM32F437x
  //        return (family=="STM32F427" || family=="STM32F437" || family=="STM32F429" || family=="STM32F439") && (density=="G" || density=="I");
  //      case 0x421:
  //        return (family=="STM32F446")
  //      case 0x427: // medium+ density STM32L
  //      case 0x436: // high density STM32L
  //        return (family=="STM32L151" || family=="STM32L152" || family=="STM32L162" || family=="STM32L100") && (density=="C" || density=="D");
  //      case 0x437: // STM32L152E
  //        return (family=="STM32L152") && (density=="E");
  //      case 0x422: // STM32F30x
  //      case 0x439: // STM32F30x
  //        return (family=="STM32F302" || family=="STM32F303");
  //      case 0x423: // STM32F401
  //      case 0x433: // STM32F401
  //        return (family=="STM32F401");
  //      case 0x435:
  //        return (family=="STM32L431" || family=="STM32L432" || family=="STM32L433" || family=="STM32L442" || family=="STM32L443");
  //      case 0x431: // STM32F411xE
  //        return (family=="STM32F411");
  //      case 0x432: // STM32F37x
  //        return (family=="STM32F372" || family=="STM32F373");
  //      case 0x434: // STM32F469/STM32F479
  //        return (family=="STM32F469" || family=="STM32F479");
  //      case 0x438: // STM32F334
  //        return (family=="STM32F334" || family=="STM32F303" || family=="STM32F328");
  //      case 0x441: // STM32F412
  //        return (family=="STM32F412");
  //      case 0x446:
  //        return (family=="STM32F303" || family=="STM32F398");
  //      case 0x449: // STM32F75x/STM32F74x
  //        return (family=="STM32F745" || family=="STM32F746" || family=="STM32F756" || family=="STM32F750");
  //      case 0x451: // STM32F76x/STM32F77x
  //        return (family=="STM32F765" || family=="STM32F767" || family=="STM32F769" || family=="STM32F777" || family=="STM32F778" || family=="STM32F779");
  //      case 0x452: // STM32F72x/STM32F73x
  //        return (family=="STM32F722" || family=="STM32F723" || family=="STM32F732" || family=="STM32F733");
  //      case 0x458: // STM32F410x
  //        return (family=="STM32F410");
  //      case 0x461:
  //        return (family=="STM32L496" || family=="STM32L4A6");
  //      case 0x462:
  //        return (family=="STM32L451" || family=="STM32L452" || family == "STM32L462");
  //      case 0x463:
  //        return (family=="STM32F413");
  //      case 0x464:
  //        return (family=="STM32L412" || family=="STM32L422");
  //      case 0x468: // STM32G4 Category 2
  //        return (family=="STM32G431" || family=="STM32G441") && (density=="6" || density=="8" || density=="B");
  //      case 0x469: // STM32G4 Category 3
  //        return (family=="STM32G471" || family=="STM32G473" || family=="STM32G474" || family=="STM32G483" || family=="STM32G484") && (density=="B" || density=="C" || density=="E");
  //      case 0x470:
  //        return (family=="STM32L4R5" || family=="STM32L4R7" || family=="STM32L4R9" || family=="STM32L4S5" || family=="STM32L4S7" || family=="STM32L4S9");
  //      case 0x471:
  //        return (family=="STM32L4P5" || family=="STM32L4Q5");
  //      case 0x479: // STM32G4 Category 4
  //        return (family=="STM32G491" || family=="STM32G4A1") && (density=="E");
  //      case 0x494:
  //        return (family=="STM32WB15");
  //      case 0x495:
  //        return (family=="STM32WB55" || family=="STM32WB35");
  //      case 0x497:
  //        return (family=="STM32WL55" || family=="STM32WL54" || family=="STM32WLE5" || family=="STM32WLE4");
  //      default:
  //        switch ((TargetInterface.peekWord(0xE00E1000) & 0xfff))
  //          {
  //            case 0x450:
  //              return (family.indexOf("STM32H74")==0 || family.indexOf("STM32H75")==0);
  //            case 0x480:
  //              return (family.indexOf("STM32H7A")==0 || family.indexOf("STM32H7B")==0);
  //          }
  //    }
  //var FIB0 = TargetInterface.peekWord(0x08040000);
  //if (FIB0 >= 0x20000000 && FIB0 <= 0x20002000)
  //  return family=="STM32W108";
  //return false;
}

//
// STM32F1xx option byte support
//
var FLASH_KEYR=0x40022004;
var FLASH_OPTKEYR=0x40022008;
var FLASH_SR=0x4002200C;
var FLASH_CR=0x40022010;

//
// Note this function will erase the RDP byte i.e. turn on read protection.
// Call STM32F_Unprotect() to turn off read protection after this has been called.
//
function STM32F_EraseOptionBytes()
{
  if (!TargetInterface.isStopped())
    TargetInterface.stopAndReset(400);
  // unlock FPEC
  TargetInterface.pokeWord(FLASH_KEYR, 0x45670123);
  TargetInterface.pokeWord(FLASH_KEYR, 0xCDEF89AB);
  // unlock OPTWRE
  TargetInterface.pokeWord(FLASH_OPTKEYR, 0x45670123);
  TargetInterface.pokeWord(FLASH_OPTKEYR, 0xCDEF89AB);
  // Erase option bytes
  var cr = TargetInterface.peekWord(FLASH_CR);
  cr |= (1<<5); // OPTER
  TargetInterface.pokeWord(FLASH_CR, cr);
  cr |= (1<<6); // STRT
  TargetInterface.pokeWord(FLASH_CR, cr);
  while (TargetInterface.peekWord(FLASH_SR) & 1);
  cr &= ~(1<<5); // ~OPTER
  TargetInterface.pokeWord(FLASH_CR, cr);
}

//
// Set the option byte at address to value
// STM32F_EraseOptionBytes() should been called before calling this function.
//
function STM32F_SetOptionByte(address, value)
{ 
  var cr = TargetInterface.peekWord(FLASH_CR);
  cr |= (1<<4); // OPTPG
  TargetInterface.pokeWord(FLASH_CR, cr);
  TargetInterface.pokeUint16(address, value);
  while (TargetInterface.peekWord(FLASH_SR) & 1);
  cr &= ~(1<<4); // ~FLASH_OPTPG
  TargetInterface.pokeWord(FLASH_CR, cr);
}

// 
// Turn off read protection
//
function STM32F_Unprotect()
{
  STM32F_SetOptionByte(0x1FFFF800, 0xA5);
}

// 
// Set user byte
//
function STM32F_SetUSER(b)
{
  STM32F_SetOptionByte(0x1FFFF802, b);
}

// 
// Set user data0
//
function STM32F_SetData0(b)
{
  STM32F_SetOptionByte(0x1FFFF804, b);
}

// 
// Set user data1
//
function STM32F_SetData1(b)
{
  STM32F_SetOptionByte(0x1FFFF806, b);
}

//
// STM32L option byte support
//
var FLASH2_PECR=0x40023C04;
var FLASH2_PEKEYR=0x40023C0C;
var FLASH2_OPTKEYR=0x40023C14;
var FLASH2_SR=0x40023C18;

function STM32L_SetOptionByte(address, value)
{
  if (!TargetInterface.isStopped())
    TargetInterface.stopAndReset(400);
  // Unlock PECR
  TargetInterface.pokeWord(FLASH2_PEKEYR, 0x89ABCDEF);
  TargetInterface.pokeWord(FLASH2_PEKEYR, 0x02030405);
  // Unlock option byte block
  TargetInterface.pokeWord(FLASH2_OPTKEYR, 0xFBEAD9C8);
  TargetInterface.pokeWord(FLASH2_OPTKEYR, 0x24252627);
  // Erase/Write option byte word
  var pecr = TargetInterface.peekWord(FLASH2_PECR);
  pecr |= (1<<8); // FTDW
  TargetInterface.pokeWord(FLASH2_PECR, pecr);
  TargetInterface.pokeWord(address, value);
  while (TargetInterface.peekWord(FLASH2_SR) & 1);
  pecr &= ~(1<<8); // ~FTDW
  TargetInterface.pokeWord(FLASH2_PECR, pecr);
}

function STM32L_MakeOptionWord(b0, b1)
{
  return (b0|b1<<8|((~b0)&0xff)<<16|((~b1)&0xff)<<24);
}

function STM32L_SetUSER(u)
{
  STM32L_SetOptionByte(0x1FF80004, STM32L_MakeOptionWord(u, 0));
}

//
// STM32F2xx option byte support
//
var FLASH3_KEYR=0x40023C04;
var FLASH3_OPTKEYR=0x40023C08;
var FLASH3_SR=0x40023C0C;
var FLASH3_CR=0x40023C10;
var FLASH3_OPTCR=0x40023C14;

//
// Set the USER option byte
//
function STM32F2xx_SetUSER(value)
{
  if (!TargetInterface.isStopped())
    TargetInterface.stopAndReset(400);
  // unlock OPTCR
  TargetInterface.pokeWord(FLASH3_OPTKEYR, 0x08192A3B);
  TargetInterface.pokeWord(FLASH3_OPTKEYR, 0x4C5D6E7F);

  // write USER option byte and then the OPTSTRT bit
  TargetInterface.pokeByte(FLASH3_OPTCR, value & 0xFC);
  TargetInterface.pokeByte(FLASH3_OPTCR, (value & 0xFC) | 2);
  // wait
  while (TargetInterface.peekWord(FLASH3_SR) & (1<<16));
}
