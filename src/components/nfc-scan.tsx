'use client';

import { useEffect, useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle, Nfc, XCircle } from 'lucide-react';
import { Button } from './ui/button';

type ScanStatus = 'idle' | 'requesting-permission' | 'scanning' | 'success' | 'unsupported' | 'error' | 'permission-denied';

interface NfcData {
  studentId: string;
  serialNumber?: string;
  rawData?: string;
}

export default function NfcScan({ onScanSuccess }: { onScanSuccess?: (result: string) => void }) {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [scanResult, setScanResult] = useState<NfcData | null>(null);
  const { toast } = useToast();

  const isNfcSupported = typeof window !== 'undefined' && 'NDEFReader' in window;

  const playBeep = (success = true) => {
    try {
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      gainNode.gain.value = 0.1;
      oscillator.frequency.value = success ? 523.25 : 261.63; // C5 for success, C4 for error
      oscillator.type = 'sine';

      oscillator.start();
      setTimeout(() => {
        oscillator.stop();
        audioContext.close();
      }, 150);
    } catch (e) {
      console.error("Failed to play beep sound.", e);
    }
  };

  const startScan = useCallback(async () => {
    if (!isNfcSupported) {
      setStatus('unsupported');
      toast({
        variant: 'destructive',
        title: 'NFC Not Supported',
        description: 'Your browser or device does not support NFC. Please use a compatible device.',
      });
      return;
    }
    
    setStatus('requesting-permission');
    
    try {
      // Request NFC permission first
      const ndef = new (window as any).NDEFReader();
      
      toast({
        title: 'Requesting NFC Access',
        description: 'Please allow NFC access when prompted.',
      });

      // This triggers the permission prompt
      await ndef.scan();
      
      setStatus('scanning');
      toast({
        title: 'NFC Ready',
        description: 'Hold your student ID card near the device.',
      });
      
      // Handle successful NFC read
      ndef.addEventListener('reading', ({ message, serialNumber }: any) => {
        try {
          const decoder = new TextDecoder();
          let studentId = '';
          let rawDataArray: string[] = [];
          
          // Try to read all records from the NFC tag
          for (const record of message.records) {
            const decodedData = decoder.decode(record.data);
            rawDataArray.push(decodedData);
            
            // If the first record looks like a student ID, use it
            if (!studentId && decodedData) {
              studentId = decodedData.trim();
            }
          }
          
          // If we couldn't decode text, try to use the serial number
          if (!studentId && serialNumber) {
            studentId = serialNumber;
          }

          const nfcData: NfcData = {
            studentId: studentId || 'Unknown',
            serialNumber: serialNumber,
            rawData: rawDataArray.join(', ') || 'No data'
          };
          
          playBeep(true);
          setScanResult(nfcData);
          setStatus('success');
          
          toast({
            title: 'Scan Successful!',
            description: `Student ID: ${nfcData.studentId}`,
          });
          
          if (onScanSuccess && studentId) {
            onScanSuccess(studentId);
          }
        } catch (decodeError) {
          console.error('Error decoding NFC data:', decodeError);
          playBeep(false);
          setStatus('error');
          toast({
            variant: 'destructive',
            title: 'Decode Error',
            description: 'Could not decode the NFC tag data.',
          });
        }
      });

      // Handle NFC read errors
      ndef.addEventListener('readingerror', () => {
        playBeep(false);
        setStatus('error');
        toast({
            variant: 'destructive',
            title: 'Scan Error',
            description: 'Could not read the NFC tag. Please try again.',
        });
      });

    } catch (error: any) {
        playBeep(false);
        console.error('NFC scan failed:', error);
        
        // Check if permission was denied
        if (error.name === 'NotAllowedError') {
          setStatus('permission-denied');
          toast({
            variant: 'destructive',
            title: 'Permission Denied',
            description: 'NFC access was denied. Please allow NFC permissions in your browser settings.',
          });
        } else {
          setStatus('error');
          toast({
            variant: 'destructive',
            title: 'NFC Error',
            description: error.message || 'Could not start NFC scanning. Make sure NFC is enabled on your device.',
          });
        }
    }
  }, [isNfcSupported, onScanSuccess, toast]);

  const getStatusContent = () => {
    switch (status) {
      case 'idle':
        return (
          <div className="text-center text-muted-foreground">
            <Nfc className="h-16 w-16 mb-4 mx-auto opacity-50" />
            <p className="font-semibold">Ready to Scan</p>
            <p className="text-sm mt-2">Click the button below to start scanning your student ID.</p>
          </div>
        );
      case 'requesting-permission':
        return (
          <div className="flex flex-col items-center justify-center text-primary">
            <Nfc className="h-16 w-16 mb-4 animate-pulse" />
            <p className="font-semibold">Requesting Permission</p>
            <p className="text-sm text-muted-foreground mt-2">Please allow NFC access in your browser...</p>
          </div>
        );
      case 'scanning':
        return (
          <div className="flex flex-col items-center justify-center text-primary animate-pulse">
            <Nfc className="h-16 w-16 mb-4" />
            <p className="font-semibold">Ready to Scan</p>
            <p className="text-sm text-muted-foreground">Hold your student ID card near your device...</p>
          </div>
        );
      case 'success':
        return (
          <div className="flex flex-col items-center justify-center text-green-500">
            <CheckCircle className="h-16 w-16 mb-4" />
            <p className="font-bold text-xl">Scan Successful!</p>
            {scanResult && (
              <div className="mt-4 p-4 bg-muted rounded-lg w-full">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-semibold text-foreground">Student ID:</span>
                    <span className="text-foreground font-mono">{scanResult.studentId}</span>
                  </div>
                  {scanResult.serialNumber && (
                    <div className="flex justify-between">
                      <span className="font-semibold text-foreground">Card Serial:</span>
                      <span className="text-foreground font-mono text-xs">{scanResult.serialNumber}</span>
                    </div>
                  )}
                  {scanResult.rawData && (
                    <div className="mt-2">
                      <span className="font-semibold text-foreground block mb-1">Raw Data:</span>
                      <span className="text-foreground text-xs break-all">{scanResult.rawData}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      case 'unsupported':
         return (
          <div className="flex flex-col items-center justify-center text-destructive">
            <XCircle className="h-16 w-16 mb-4" />
            <p className="font-bold">NFC Not Supported</p>
            <p className="text-sm text-center mt-2">Your browser or device does not support WebNFC.</p>
            <p className="text-xs text-muted-foreground mt-2">Try using Chrome on Android.</p>
          </div>
        );
      case 'permission-denied':
        return (
          <div className="flex flex-col items-center justify-center text-destructive">
            <XCircle className="h-16 w-16 mb-4" />
            <p className="font-bold">Permission Denied</p>
            <p className="text-sm text-center mt-2">NFC access was denied. Please allow NFC permissions in your browser settings.</p>
          </div>
        );
       case 'error':
         return (
          <div className="flex flex-col items-center justify-center text-destructive">
            <XCircle className="h-16 w-16 mb-4" />
            <p className="font-bold">Scan Failed</p>
            <p className="text-sm text-center mt-2">Could not read the NFC tag. Please try again.</p>
          </div>
        );
    }
  }

  return (
    <div className="py-4 flex flex-col items-center justify-center gap-4">
        <div className="relative w-full min-h-[280px] rounded-md flex items-center justify-center bg-muted/30 p-6">
            {getStatusContent()}
        </div>
        <Button 
          onClick={startScan} 
          disabled={status === 'scanning' || status === 'requesting-permission' || !isNfcSupported} 
          className="w-full"
        >
            {status === 'success' || status === 'error' || status === 'permission-denied' ? 'Scan Again' : 
             status === 'requesting-permission' ? 'Requesting Permission...' :
             status === 'scanning' ? 'Scanning...' : 'Start NFC Scan'}
        </Button>
        {!isNfcSupported && (
          <p className="text-xs text-muted-foreground text-center">
            WebNFC is currently only supported on Chrome for Android.
          </p>
        )}
    </div>
  );
}
