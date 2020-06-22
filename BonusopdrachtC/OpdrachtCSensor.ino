#include <ESP8266WiFi.h>
#include <WiFiClientSecure.h>

const char *ssid = "Postma Wifi"; 
const char *password = "uXKPTJQV05";  
const char* host = "script.google.com"; 
const char* fingerprint = "10 76 e5 ec 2c ed 13 e1 cd 00 25 52 b3 a4 9c c1 83 cf 53 67";
String url;


void setup() 
{
  Serial.begin(115200);
  delay(100);
  Serial.println();
  Serial.println();
  Serial.print("Connecting to ");
  Serial.println(ssid);
  
  WiFi.begin(ssid, password); 
  while (WiFi.status() != WL_CONNECTED) 
  {
    delay(500);
    Serial.print(".");
  }
 
  Serial.println("");
  Serial.println("WiFi connected");  
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  Serial.print("Netmask: ");
  Serial.println(WiFi.subnetMask());
  Serial.print("Gateway: ");
  Serial.println(WiFi.gatewayIP());
}


void loop() 
{
  Serial.print("connecting to ");
  Serial.println(host);
 
  WiFiClientSecure client;

  const int httpPort = 443;
  client.setFingerprint(fingerprint);
  if (!client.connect(host, httpPort)) 
  {
    Serial.println("connection failed");
    return;
  }
 
  if (Serial.available() > 0) {
      char bfr[101];
      memset(bfr,0, 101);
      Serial.readBytesUntil( '\n',bfr,100);
      Serial.println(bfr);

      url = "/macros/s/AKfycbxrb3ZCGKvLJLzyEPDBZVqEgH8xYl7TU77BJ2zSteHzfRSUUTcs/exec?tag=Temperatuur&sheet=Groep02&value=" + String(bfr);
      Serial.print("Requesting URL: ");
      Serial.println(url);
      
      client.print(String("GET ") + url + " HTTP/1.1\r\n" +
                   "Host: " + host + "\r\n" + 
                   "Connection: close\r\n\r\n");
      delay(500);
      String section="header";
      while(client.available())
      {
        String line = client.readStringUntil('\r');
        Serial.print(line);
      }
      Serial.println();
      Serial.println("closing connection");
      delay(6000);
      }
}
