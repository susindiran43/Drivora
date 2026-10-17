# CarResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**make** | **str** | Vehicle manufacturer | 
**model** | **str** | Vehicle model | 
**year** | **int** | Model release year | 
**daily_rate** | **float** | Daily rental price in USD | 
**available** | **bool** | Operational rental eligibility | [optional] 
**category** | **str** | Vehicle segment/category | [optional] 
**image_url** | **str** | URL or path to vehicle photo | [optional] 
**description** | **str** | Detailed vehicle description | [optional] 
**id** | **int** |  | 

## Example

```python
from openapi_client.models.car_response import CarResponse

# TODO update the JSON string below
json = "{}"
# create an instance of CarResponse from a JSON string
car_response_instance = CarResponse.from_json(json)
# print the JSON string representation of the object
print(CarResponse.to_json())

# convert the object into a dict
car_response_dict = car_response_instance.to_dict()
# create an instance of CarResponse from a dict
car_response_from_dict = CarResponse.from_dict(car_response_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


