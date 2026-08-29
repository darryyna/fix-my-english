import { useEffect } from 'react';
import { Text, View } from 'react-native';
import { supabase } from '@/lib/supabase';

export default function Index() {
    useEffect(() => {
        supabase.auth.getSession().then(({ data, error }) => {
            if (error) {
                console.log('Supabase connection ERROR:', error.message);
            } else {
                console.log('Supabase connected OK. Session:', data.session);
            }
        });
    }, []);

    return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text>Fix My English</Text>
        </View>
    );
}