import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import {Provider as PaperProvider} from 'react-native-paper';
import theme from './paper/theme';

import Main from './components/MainComponent';



export default function App() {
  return (
    <PaperProvider theme={theme}>
     <Main/>
    </PaperProvider>
  );
}


