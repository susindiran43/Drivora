# CarCreate


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

## Example

```python
from openapi_client.models.car_create import CarCreate

# TODO update the JSON string below
json = "{}"
# create an instance of CarCreate from a JSON string
car_create_instance = CarCreate.from_json(json)
# print the JSON string representation of the object
print(CarCreate.to_json())

# convert the object into a dict
car_create_dict = car_create_instance.to_dict()
# create an instance of CarCreate from a dict
car_create_from_dict = CarCreate.from_dict(car_create_dict)
```
[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)


