import React, { useEffect, useState } from 'react';
import { Text, Button, View, FlatList, StyleSheet, TouchableHighlight, Modal, Pressable, Image } from 'react-native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { NavigationContainer } from '@react-navigation/native';

function HomeScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button
                onPress={() => navigation.navigate('Notifications')}
                title="Go to notifications"
            />
        </View>
    );
}

function NotificationsScreen({ navigation }) {
    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Button onPress={() => navigation.goBack()} title="Go back home" />
        </View>
    );
}

function PokemonScreen(){
    const [elementos,guardarlista] = useState([]);
    const [ modalVisible, setModalVisible ] = useState(false);
    const [ infoPokemon, setInfoPokemon ] = useState(null)

    useEffect( () => {
        fetch('https://pokeapi.co/api/v2/pokemon?offset=0&limit=10', { method: 'GET' })
        .then((response) => response.json())
        .then((responseJson) => {
            const listado=responseJson.results;
            guardarlista(listado);
        })
        .catch((error) => {
            console.error(error);
        });
    }, [])

    const getInfoPoke = ({ url }) => {
        fetch(`${url}`, { method: 'GET' })
        .then((response) => response.json())
        .then((data) => {
            let listado = data;
            setInfoPokemon(listado);
            setModalVisible(true);
        })
        .catch((error) => {
            console.error(error);
        });
    }
    
    return(
    <>
        <View style={{flex:1}} >
            <Text style={{fontSize:18,textAlign:'center',height:40,marginTop:10,backgroundColor:'lightgray',textAlignVertical:'center', borderRadius:10,marginLeft:10,marginRight:10}}> Pokemones</Text>
            <FlatList
                data={elementos}
                keyExtractor = { item => item.name }
                renderItem={({item})=>
                    <View style = {{ alignItems: 'center', marginVertical: 5}}>
                        <TouchableHighlight 
                            style = {{ width: '90%', alignItems: 'center', backgroundColor: "#2196f3", borderRadius: 15 }}
                            onPress = { () => getInfoPoke(item) }
                        >
                            <Text style= { styles.item }>{ item.name }</Text>
                        </TouchableHighlight>
                    </View>
                }
            />
        </View>
        {
            infoPokemon === null ? (
                <Text></Text>
            ) : (
                <ModalPoke info = { infoPokemon } setModalVisible ={ setModalVisible } modalVisible = { modalVisible } />
            )
        }
    </>
    );
}

const ModalPoke = ( {info, modalVisible, setModalVisible} ) => {
    return(
        <Modal
            animationType="slide"
            visible={modalVisible}
            presentationStyle='fullScreen'
            onRequestClose={() => {
                setModalVisible(!modalVisible);
            }}
        >
            <View style={styles.centeredView}>
                <Text style={styles.modalText}>{ info.name }</Text>
                <Image style = { styles.img } source = {{ uri: `${info.sprites.front_default}`, }} />
                
                <Text style={styles.modalText} >Tipo:</Text>
                <View style = {{ display: 'flex', flexDirection: 'row', marginBottom: 10 }}>
                    { info.types.map( type => (
                        <Text key = { type.slot } style = { styles.types }>{ type.type.name }</Text>
                    ) ) }
                </View>
                <Text style={styles.modalText}>Altura: </Text>
                <Text style={styles.modalText}>{ info.height / 10 } m</Text>
                <Text style={styles.modalText}>Peso: </Text>
                <Text style={styles.modalText}>{ info.weight / 10 } KG</Text>

                <Pressable
                    style={[styles.button, styles.buttonClose]}
                    onPress={() => setModalVisible(!modalVisible)}
                >
                    <Text style={[ styles.textStyle, { fontSize: 20 }]}>Cerrar</Text>
                </Pressable>
            </View>
        </Modal>
    )
}


const Drawer = createDrawerNavigator();

export default function App() {
    return (
        <NavigationContainer>
            <Drawer.Navigator initialRouteName="Home">
                <Drawer.Screen name="Home" component={HomeScreen} />
                <Drawer.Screen name="Notifications" component={NotificationsScreen} />
                <Drawer.Screen name="Lista" component={PokemonScreen}/>
            </Drawer.Navigator>
        </NavigationContainer>
    );
}

const styles = StyleSheet.create({
    item: {
        padding: 10,
        fontSize: 18,
        height: 44,
        color: '#FFF'
    },
    centeredView: {
        flex: 1,
        alignItems: "center",
        marginTop: 22
      },
      modalView: {
        margin: 20,
        backgroundColor: "white",
        borderRadius: 20,
        padding: 35,
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
      },
      img: {
          width: 200,
          height: 200,
      },
      button: {
        padding: 10,
        elevation: 2,
        bottom: 0,
        position: 'absolute',
        width: '100%',
      },
      types:{
        textAlign: 'center',
        color: '#FFF',
        borderRadius: 20,
        padding: 10,
        width: '30%',
        backgroundColor: "#2196F3",
        marginHorizontal: 5,
        fontSize: 18,
      },
      buttonOpen: {
        backgroundColor: "#F194FF",
      },
      buttonClose: {
        backgroundColor: "#2196F3",
      },
      textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center"
      },
      modalText: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: "center"
      }
});