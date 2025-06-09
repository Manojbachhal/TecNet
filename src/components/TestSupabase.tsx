import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

export const TestSupabase = () => {
  const [testResult, setTestResult] = useState<string>('Testing connection...');

  useEffect(() => {
    const testConnection = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .limit(1);

        if (error) {
          setTestResult(`Error: ${error.message}`);
        } else {
          setTestResult(`Success! Connected to Supabase. Data: ${JSON.stringify(data)}`);
        }
      } catch (err) {
        setTestResult(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };

    testConnection();
  }, []);

  return (
    <div>
      <h2>Supabase Connection Test</h2>
      <p>{testResult}</p>
    </div>
  );
}; 