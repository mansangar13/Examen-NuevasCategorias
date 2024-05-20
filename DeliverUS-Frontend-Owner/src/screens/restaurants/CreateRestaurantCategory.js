import React, { useEffect, useState } from 'react'
import { Pressable, ScrollView, StyleSheet, View } from 'react-native'
// import * as ExpoImagePicker from 'expo-image-picker'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import InputItem from '../../components/InputItem'
import TextRegular from '../../components/TextRegular'
import * as GlobalStyles from '../../styles/GlobalStyles'
// import defaultProductImage from '../../../assets/product.jpeg'
import { getRestaurantCategories, createRestaurantCategories } from '../../api/RestaurantEndpoints'
import { showMessage } from 'react-native-flash-message'
// import DropDownPicker from 'react-native-dropdown-picker'
import * as yup from 'yup'
import { Formik } from 'formik'
import TextError from '../../components/TextError'

export default function CreateRestaurantCategory ({ navigation, route }) {
  // const [open, setOpen] = useState(false)
  const [restaurantCategory, setRestaurantCategory] = useState([])
  const [backendErrors, setBackendErrors] = useState()

  const initialRestaurantCategoryValues = { name: null }
  const validationSchema = yup.object().shape({
    name: yup
      .string()
      .max(50, 'Name too long')
      .required('Name is required')
  })

  useEffect(() => {
    async function fetchRestaurantCategories () {
      try {
        const fetchedRestaurantCategories = await getRestaurantCategories()
        /*
        const fetchedProductCategoriesReshaped = fetchedProductCategories.map((e) => {
          return {
            label: e.name,
            value: e.id
          }
        })
        */
        setRestaurantCategory(fetchedRestaurantCategories)
      } catch (error) {
        showMessage({
          message: `There was an error while retrieving restaurant categories. ${error} `,
          type: 'error',
          style: GlobalStyles.flashStyle,
          titleStyle: GlobalStyles.flashTextStyle
        })
      }
    }
    fetchRestaurantCategories()
  }, [])

  useEffect(() => {
    console.log('Route Params:', route.params) // Verifica que los parámetros están presentes
  }, [route.params])

  const createRestCategory = async (values) => {
    setBackendErrors([])
    try {
      const createdRestCategory = await createRestaurantCategories(values)
      console.log(createdRestCategory)
      showMessage({
        message: `Restaurant category ${createdRestCategory.name} succesfully created`,
        type: 'success',
        style: GlobalStyles.flashStyle,
        titleStyle: GlobalStyles.flashTextStyle
      })
      navigation.navigate('CreateRestaurantScreen', { refresh: true })
    } catch (error) {
      console.log(error)
      setBackendErrors(error.errors)
    }
  }
  // si una categoria ya existe da error y no la crea
  return (
    <Formik
      validationSchema={validationSchema}
      initialValues={initialRestaurantCategoryValues}
      onSubmit={createRestCategory}>
      {({ handleSubmit, setFieldValue, values }) => (
        <ScrollView>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: '60%' }}>
              <InputItem
                name='name'
                label='Name:'
              />
              {backendErrors &&
                backendErrors.map((error, index) => <TextError key={index}>{error.param}-{error.msg}</TextError>)
              }
              <Pressable
                onPress={ handleSubmit }
                style={({ pressed }) => [
                  {
                    backgroundColor: pressed
                      ? GlobalStyles.brandSuccessTap
                      : GlobalStyles.brandSuccess
                  },
                  styles.button
                ]}>
                <View style={[{ flex: 1, flexDirection: 'row', justifyContent: 'center' }]}>
                  <MaterialCommunityIcons name='content-save' color={'white'} size={20}/>
                  <TextRegular textStyle={styles.text}>
                    Save
                  </TextRegular>
                </View>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      )}
    </Formik>
  )
}

const styles = StyleSheet.create({
  button: {
    borderRadius: 8,
    height: 40,
    padding: 10,
    width: '100%',
    marginTop: 20,
    marginBottom: 20
  },
  text: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
    marginLeft: 5

  },
  imagePicker: {
    height: 40,
    paddingLeft: 10,
    marginTop: 20,
    marginBottom: 80
  },
  image: {
    width: 100,
    height: 100,
    borderWidth: 1,
    alignSelf: 'center',
    marginTop: 5
  },
  switch: {
    marginTop: 5
  }
})
