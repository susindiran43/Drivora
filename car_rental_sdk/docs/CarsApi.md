# openapi_client.CarsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**create_car_cars_post**](CarsApi.md#create_car_cars_post) | **POST** /cars/ | Create a new car
[**get_car_cars_car_id_get**](CarsApi.md#get_car_cars_car_id_get) | **GET** /cars/{car_id} | Retrieve a car by ID
[**get_car_rentals_cars_car_id_rentals_get**](CarsApi.md#get_car_rentals_cars_car_id_rentals_get) | **GET** /cars/{car_id}/rentals | List active rentals for a car
[**list_available_cars_cars_get**](CarsApi.md#list_available_cars_cars_get) | **GET** /cars/ | List operationally available cars
[**rent_car_cars_car_id_rent_post**](CarsApi.md#rent_car_cars_car_id_rent_post) | **POST** /cars/{car_id}/rent | Create a rental booking for a car


# **create_car_cars_post**
> CarResponse create_car_cars_post(car_create)

Create a new car

Create a new vehicle record in the Drivora fleet.

### Example


```python
import openapi_client
from openapi_client.models.car_create import CarCreate
from openapi_client.models.car_response import CarResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.CarsApi(api_client)
    car_create = openapi_client.CarCreate() # CarCreate | 

    try:
        # Create a new car
        api_response = api_instance.create_car_cars_post(car_create)
        print("The response of CarsApi->create_car_cars_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->create_car_cars_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_create** | [**CarCreate**](CarCreate.md)|  | 

### Return type

[**CarResponse**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_car_cars_car_id_get**
> CarResponse get_car_cars_car_id_get(car_id)

Retrieve a car by ID

Fetch details for a single vehicle by ID.
Returns 404 if the vehicle does not exist.

### Example


```python
import openapi_client
from openapi_client.models.car_response import CarResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.CarsApi(api_client)
    car_id = 56 # int | 

    try:
        # Retrieve a car by ID
        api_response = api_instance.get_car_cars_car_id_get(car_id)
        print("The response of CarsApi->get_car_cars_car_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->get_car_cars_car_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_id** | **int**|  | 

### Return type

[**CarResponse**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_car_rentals_cars_car_id_rentals_get**
> List[RentalResponse] get_car_rentals_cars_car_id_rentals_get(car_id)

List active rentals for a car

Inspect active reservations for this vehicle to power the calendar availability display.

### Example


```python
import openapi_client
from openapi_client.models.rental_response import RentalResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.CarsApi(api_client)
    car_id = 56 # int | 

    try:
        # List active rentals for a car
        api_response = api_instance.get_car_rentals_cars_car_id_rentals_get(car_id)
        print("The response of CarsApi->get_car_rentals_cars_car_id_rentals_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->get_car_rentals_cars_car_id_rentals_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_id** | **int**|  | 

### Return type

[**List[RentalResponse]**](RentalResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **list_available_cars_cars_get**
> List[CarResponse] list_available_cars_cars_get(skip=skip, limit=limit, make=make, min_price=min_price, max_price=max_price, search=search, start_date=start_date, end_date=end_date)

List operationally available cars

Retrieve all cars that are operationally available for rental.
Optional filters allow narrowing down by search keywords, daily rate range, and specific rental dates.

### Example


```python
import openapi_client
from openapi_client.models.car_response import CarResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.CarsApi(api_client)
    skip = 0 # int |  (optional) (default to 0)
    limit = 100 # int |  (optional) (default to 100)
    make = 'make_example' # str | Filter by make (optional)
    min_price = 3.4 # float | Minimum daily rate (optional)
    max_price = 3.4 # float | Maximum daily rate (optional)
    search = 'search_example' # str | Search term for make, model, category (optional)
    start_date = '2013-10-20' # date | Rental start date (inclusive) (optional)
    end_date = '2013-10-20' # date | Rental end date (exclusive) (optional)

    try:
        # List operationally available cars
        api_response = api_instance.list_available_cars_cars_get(skip=skip, limit=limit, make=make, min_price=min_price, max_price=max_price, search=search, start_date=start_date, end_date=end_date)
        print("The response of CarsApi->list_available_cars_cars_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->list_available_cars_cars_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skip** | **int**|  | [optional] [default to 0]
 **limit** | **int**|  | [optional] [default to 100]
 **make** | **str**| Filter by make | [optional] 
 **min_price** | **float**| Minimum daily rate | [optional] 
 **max_price** | **float**| Maximum daily rate | [optional] 
 **search** | **str**| Search term for make, model, category | [optional] 
 **start_date** | **date**| Rental start date (inclusive) | [optional] 
 **end_date** | **date**| Rental end date (exclusive) | [optional] 

### Return type

[**List[CarResponse]**](CarResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**200** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **rent_car_cars_car_id_rent_post**
> RentalResponse rent_car_cars_car_id_rent_post(car_id, rental_create)

Create a rental booking for a car

Book a car for a half-open date interval [start_date, end_date).
Validates:
- Car exists (404)
- Operational rental eligibility (400)
- Date ordering start_date < end_date (422)
- Overlapping active rentals (409)

### Example


```python
import openapi_client
from openapi_client.models.rental_create import RentalCreate
from openapi_client.models.rental_response import RentalResponse
from openapi_client.rest import ApiException
from pprint import pprint

# Defining the host is optional and defaults to http://localhost
# See configuration.py for a list of all supported configuration parameters.
configuration = openapi_client.Configuration(
    host = "http://localhost"
)


# Enter a context with an instance of the API client
with openapi_client.ApiClient(configuration) as api_client:
    # Create an instance of the API class
    api_instance = openapi_client.CarsApi(api_client)
    car_id = 56 # int | 
    rental_create = openapi_client.RentalCreate() # RentalCreate | 

    try:
        # Create a rental booking for a car
        api_response = api_instance.rent_car_cars_car_id_rent_post(car_id, rental_create)
        print("The response of CarsApi->rent_car_cars_car_id_rent_post:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling CarsApi->rent_car_cars_car_id_rent_post: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **car_id** | **int**|  | 
 **rental_create** | [**RentalCreate**](RentalCreate.md)|  | 

### Return type

[**RentalResponse**](RentalResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**201** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

