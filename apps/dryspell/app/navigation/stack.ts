// Native: re-export the native stack navigator. Metro picks stack.web.ts
// for web builds, which substitutes the JS-based stack navigator.
export { createNativeStackNavigator } from '@react-navigation/native-stack';
