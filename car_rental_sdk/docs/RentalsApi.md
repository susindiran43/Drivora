# openapi_client.RentalsApi

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**cancel_rental_rentals_rental_id_delete**](RentalsApi.md#cancel_rental_rentals_rental_id_delete) | **DELETE** /rentals/{rental_id} | Cancel an active rental
[**get_rental_rentals_rental_id_get**](RentalsApi.md#get_rental_rentals_rental_id_get) | **GET** /rentals/{rental_id} | Retrieve a rental by ID
[**list_rentals_rentals_get**](RentalsApi.md#list_rentals_rentals_get) | **GET** /rentals/ | List all rentals


# **cancel_rental_rentals_rental_id_delete**
> cancel_rental_rentals_rental_id_delete(rental_id)

Cancel an active rental

Cancel an active rental.
Releases the reserved dates, allowing subsequent bookings for those dates.
Returns HTTP 204 on success, or HTTP 404 if the rental does not exist.

### Example


```python
import openapi_client
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
    api_instance = openapi_client.RentalsApi(api_client)
    rental_id = 56 # int | 

    try:
        # Cancel an active rental
        api_instance.cancel_rental_rentals_rental_id_delete(rental_id)
    except Exception as e:
        print("Exception when calling RentalsApi->cancel_rental_rentals_rental_id_delete: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **rental_id** | **int**|  | 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

### HTTP response details

| Status code | Description | Response headers |
|-------------|-------------|------------------|
**204** | Successful Response |  -  |
**422** | Validation Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **get_rental_rentals_rental_id_get**
> RentalResponse get_rental_rentals_rental_id_get(rental_id)

Retrieve a rental by ID

Get detailed information about a specific rental.

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
    api_instance = openapi_client.RentalsApi(api_client)
    rental_id = 56 # int | 

    try:
        # Retrieve a rental by ID
        api_response = api_instance.get_rental_rentals_rental_id_get(rental_id)
        print("The response of RentalsApi->get_rental_rentals_rental_id_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RentalsApi->get_rental_rentals_rental_id_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **rental_id** | **int**|  | 

### Return type

[**RentalResponse**](RentalResponse.md)

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

# **list_rentals_rentals_get**
> List[RentalResponse] list_rentals_rentals_get(skip=skip, limit=limit, user_name=user_name)

List all rentals

Retrieve all rentals with car details, ordered by most recent booking first.

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
    api_instance = openapi_client.RentalsApi(api_client)
    skip = 0 # int |  (optional) (default to 0)
    limit = 100 # int |  (optional) (default to 100)
    user_name = 'user_name_example' # str | Filter by customer name (optional)

    try:
        # List all rentals
        api_response = api_instance.list_rentals_rentals_get(skip=skip, limit=limit, user_name=user_name)
        print("The response of RentalsApi->list_rentals_rentals_get:\n")
        pprint(api_response)
    except Exception as e:
        print("Exception when calling RentalsApi->list_rentals_rentals_get: %s\n" % e)
```



### Parameters


Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **skip** | **int**|  | [optional] [default to 0]
 **limit** | **int**|  | [optional] [default to 100]
 **user_name** | **str**| Filter by customer name | [optional] 

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

