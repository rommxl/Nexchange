from sklearn.preprocessing import MinMaxScaler
from keras.layers import Dense,Dropout,SimpleRNN,LSTM,GRU
from keras.models import Sequential
from django.shortcuts import render
from django.http import JsonResponse,HttpResponse
import numpy as np
import pandas as pd
import requests
import json

# Create your views here.
base = "https://api.frankfurter.app/1999-01-01..?amount=1&from="

def fetch_data(request):
    if(request.method == 'POST'):
        json_data = json.loads(request.body.decode('utf-8'))
        # print(json_data)
        conv_from = json_data['from']
        conv_to = json_data['to']

        api = '{}{}&to={}'.format(base,conv_from,conv_to)
        res = requests.get(api)
        json_data = json.loads(res.text)
        data = json_data['rates']
        rates = []
        final_date = ""
        for i in data:
            rates.append(json_data['rates'][i][conv_to])
            final_date = i
        data = pd.DataFrame({'rates':rates})
        data.to_csv('data.csv')

        return data,final_date,conv_from,conv_to
        # return (np.array(rates))
        # return HttpResponse(rates)

def predict(request):
    df,last_date,conv_from,conv_to = fetch_data(request)
    timestep = 365
    future_days = 10
    epochs = 20                 #timesteps  

    split = (int(len(df) *1))
    data = df.iloc[0:split]
    data = np.array(data['rates'])

    data = data.reshape(-1,1)
    scaler = MinMaxScaler(feature_range=(0,1))
    train = scaler.fit_transform(data)
    
    xtrain = []
    ytrain = []
    #time step of var days
    for i in range(timestep,len(data)):
        xtrain.append(train[i-timestep:i,0])
        ytrain.append(train[i,0])
    xtrain, ytrain = np.array(xtrain),np.array(ytrain)
    xtrain = xtrain.reshape(xtrain.shape[0],xtrain.shape[1],1)

    model = Sequential()
    model.add(SimpleRNN(100,input_shape = (xtrain.shape[1],1)))
    # model.add(SimpleRNN(20))
    # model.add(SimpleRNN(75,input_shape = (xtrain.shape[1],1)))
    # model.add(Dropout(0.2))
    model.add(Dense(1))
    model.compile(optimizer='adam',loss='mean_squared_error')
    model.fit(xtrain,ytrain,epochs=epochs)

    inputs = df[len(df)-timestep:].values
    result_array = [str(data[-1][0])]
    for i in range(0,future_days):
        inputs = inputs[-1 * timestep:]
        inputs = inputs.reshape(-1,1)
        inputs = scaler.transform(inputs)
        inputs = inputs.reshape(-1,timestep)

        predicted_price = model.predict(inputs)
        predicted_price = scaler.inverse_transform(predicted_price)

        result_array.append(str(predicted_price[0][0]))

        inputs = inputs.reshape(-1,1)
        inputs = scaler.inverse_transform(inputs)
        inputs = np.append(inputs,predicted_price[0][0],axis=None)          #axis = none as it is reshaped at start of loop
    # response = {"price":float(predicted_price[0][0])}
    response = {
        "price":result_array,
        "last_date":last_date,
        "conv_from":conv_from,
        "conv_to":conv_to,
        "pred_len":future_days,
        }
    # response = json.dumps({"price":list(result_array)})
    # print(response)
    return JsonResponse(response)


