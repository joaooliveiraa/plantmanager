import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import { Welcome } from "../pages/Welcome";
import { UserIdentification } from "../pages/UserIdentification";
import { Confirmation } from "../pages/Confirmation";

import colors from "../styles/colors";

const stackRoutes = createStackNavigator();

//Pilha de navegação
const AppRoutes: React.FC = () => (
  <stackRoutes.Navigator
    headerMode="none"
    screenOptions={{
      cardStyle: {
        backgroundColor: colors.white,
      },
    }}
  >
    <stackRoutes.Screen //Tela que primeiro estiver aqui é a primeira que irá listar
      name="Welcome"
      component={Welcome}
    />

    <stackRoutes.Screen
      name="UserIdentification"
      component={UserIdentification}
    />

    <stackRoutes.Screen 
      name="Confirmation" 
      component={Confirmation} 
    />
  </stackRoutes.Navigator>
)

export default AppRoutes;
