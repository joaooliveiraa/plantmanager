import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { EnviromentButton } from "../components/EnviromentButton";

import { Header } from "../components/Header";
import { PlantCardPrimary } from "../components/PlantCardPrimary";
import { Load } from "../components/Load";

import api from "../services/api";

import colors from "../styles/colors";
import fonts from "../styles/fonts";

interface EnvironmentProps {
  key: string;
  title: string;
}

interface PlantProps {
  id: string;
  name: string;
  about: string;
  water_tips: string;
  photo: string;
  environments: [string];
  frequency: {
    times: number;
    repeat_every: string;
  };
}

export function PlantSelect() {
  const [environments, setEnvinroments] = useState<EnvironmentProps[]>([]);
  const [plants, setPlants] = useState<PlantProps[]>([]);
  const [filteredPlants, setFilteredPlants] = useState<PlantProps[]>([]); //Estado auxiliar para filtrar,
  //assim não é necessario fazer requisição para api o tempo todo

  const [environmentSelected, setEnvironmentSelected] = useState("all");
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false); //Saber se tem mais coisas para carregar
  const [loadedAll, setLoadedAll] = useState(false); //Saber se tem mais coisas para carregar

  function handleEnviromentSelected(environment: string) {
    setEnvironmentSelected(environment);

    if (environment == "all") return setFilteredPlants(plants);
    //Se for a opção 'todos', seta todas as informações da api

    const filtered = plants.filter((plant) =>
      plant.environments.includes(environment)
    );

    setFilteredPlants(filtered);
  }

  async function fetchPlants() {
    const { data } = await api.get(
      `plants?_sort=name&asc&_page=${page}&_limit=8`
    );

    if (!data) {
      return setLoading(true);
    }

    if (page > 1) {
      setPlants((oldValue) => [...oldValue, ...data]);
      setFilteredPlants((oldValue) => [...oldValue, ...data]);
    } else {
      setPlants(data);
      setFilteredPlants(data);
    }

    setLoading(false);
    setLoadingMore(false);
  }

  function handleFetchMore(distance: number) {
    if (distance < 1) {
      return;
    } else {
      setLoadingMore(true);
      setPage((oldValue) => oldValue + 1);
      fetchPlants();
    }
  }

  useEffect(() => {
    async function fetchEnviroment() {
      const { data } = await api.get("plants_environments?_sort=title&asc");
      setEnvinroments([
        /*Para adicionar opção a mais + os dados (data)*/
        {
          key: "all",
          title: "Todos",
        },
        ...data,
      ]);
    }

    fetchEnviroment();
  }, []);

  useEffect(() => {
    fetchPlants();
  }, []);

  if (loading) return <Load />;
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Header />

        <Text style={styles.title}>Em qual ambiente</Text>
        <Text style={styles.subtitle}>Você quer colocar sua planta?</Text>
      </View>

      <View>
        <FlatList
          data={environments}
          keyExtractor={(item) => String(item.key)} //Sempre incluir uma chave na flat list string para melhor performace
          renderItem={({ item }) => (
            <EnviromentButton
              title={item.title}
              active={item.key == environmentSelected}
              onPress={() => handleEnviromentSelected(item.key)}
            />
          )}
          horizontal
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.enviromentList}
        />
      </View>

      <View style={styles.plants}>
        <FlatList
          data={filteredPlants}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => <PlantCardPrimary data={item} />}
          showsVerticalScrollIndicator={false} //Desabilitar barra scrollview
          numColumns={2}
          onEndReachedThreshold={0.1} //Quando usuario chegar em 10% do final da tela
          onEndReached={({ distanceFromEnd }) => handleFetchMore(distanceFromEnd)} //Quando chegar executa isso
          ListFooterComponent={ //Aparecer o indicador no footer da tela  somente quando esta carregando
            loadingMore ?
            <ActivityIndicator color ={colors.green} />
            : <></>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 17,
    color: colors.heading,
    fontFamily: fonts.heading,
    lineHeight: 20,
    marginTop: 15,
  },
  subtitle: {
    fontFamily: fonts.text,
    fontSize: 17,
    lineHeight: 20,
    color: colors.heading,
  },
  enviromentList: {
    height: 40,
    justifyContent: "center",
    paddingBottom: 5,
    marginLeft: 32,
    marginVertical: 32,
  },
  plants: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: "center",
  },
});
