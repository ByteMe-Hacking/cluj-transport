package com.example;

import android.app.Activity;
import android.content.Context;
import android.os.Bundle;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.util.Log;
import android.widget.TextView;
import com.example.R;

import java.io.IOException;
import java.io.InputStream;
import java.util.ArrayList;
import java.util.List;

import org.apache.http.HttpResponse;
import org.apache.http.NameValuePair;
import org.apache.http.client.ClientProtocolException;
import org.apache.http.client.HttpClient;
import org.apache.http.client.entity.UrlEncodedFormEntity;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.StringEntity;
import org.apache.http.impl.client.DefaultHttpClient;
import org.apache.http.message.BasicNameValuePair;
import org.apache.http.params.HttpConnectionParams;
import org.json.JSONObject;


public class GPSTestActivity extends Activity  {

	private LocationManager lm;
	private TextView tv;
	
    /** Called when the activity is first created. */
    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.main);
        
        tv = (TextView) findViewById(R.id.label1);
        lm = (LocationManager) getSystemService(Context.LOCATION_SERVICE);
        LocationListener locList = new MyLocationListener();
        lm.requestLocationUpdates(LocationManager.GPS_PROVIDER, 60000, 50, locList);
        tv.setText("start");

    }
    
/* Class My Location Listener */
private class MyLocationListener implements LocationListener   {
    // XXX: Un-comment if you want to sent strings to server
    public void postData(String lat, String lon) {
    	// Create a new HttpClient and Post Header
        HttpClient httpclient = new DefaultHttpClient();
        HttpPost httppost = new HttpPost("http://coolbox.clujcowork.ro:9000/");

        try {
            // Add your data
        	tv.setText("Send "+lat+"," +lon+",2");
            httppost.setEntity(new StringEntity(lat+"," +lon+",2"));
   
            // Execute HTTP Post Request
            HttpResponse response = httpclient.execute(httppost);
            
        } catch (ClientProtocolException e) {
            // TODO Auto-generated catch block
        } catch (IOException e) {
            // TODO Auto-generated catch block
        }
    }
    @Override
    public void onLocationChanged(Location arg0) {
    	tv.setText("ok");
        String lat = String.valueOf(arg0.getLatitude());
        String lon = String.valueOf(arg0.getLongitude());
        tv.setText("lat="+lat+", lon="+lon); 
        postData(lat, lon);
                     
    }
    @Override
    public void onProviderDisabled(String arg0) {
        Log.e("GPS", "provider disabled " + arg0);
        tv.setText("Provider disabled");
    }
    @Override
    public void onProviderEnabled(String arg0) {
        Log.e("GPS", "provider enabled " + arg0);
        tv.setText("Provider enabled");
    }
    @Override
    public void onStatusChanged(String arg0, int arg1, Bundle arg2) {
        Log.e("GPS", "status changed to " + arg0 + " [" + arg1 + "]");
        tv.setText("status changed to" + arg0 + " [" + arg1 + "]");
    }
}
}