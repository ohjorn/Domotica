#include <ESP8266WiFi.h>
#include <PubSubClient.h>

// Netwerk connectie
const char* ssid = "***";
const char* password = "***";
const char* mqtt_server = "onto.mywire.org";
#define mqtt_port 1883

WiFiClient wifiClient;

PubSubClient client(wifiClient);

void setup_wifi() {
    delay(10);
    // Connectie naar WiFi
    Serial.println();
    Serial.print("Connecting to ");
    Serial.println(ssid);
    WiFi.begin(ssid, password);
    while (WiFi.status() != WL_CONNECTED) {
      delay(500);
      Serial.print(".");
    }
    
    randomSeed(micros());
    Serial.println("");
    Serial.println("WiFi connected");
    Serial.println("IP address: ");
    Serial.println(WiFi.localIP());
}

void reconnect() {
  while (!client.connected()) {
    Serial.print("Attempting MQTT connection...");
    String clientId = "ESPClient-Johannes";
    //clientId += String(random(0xffff), HEX);
    
    // Probeer te verbinden
    if (client.connect(clientId.c_str())) {
      Serial.println("connected");
      // Bericht om aan te geven dat ESP geconnect is met rfid topic.
      client.publish("/rfid", "ESP van Johannes geconnect aan rfid server.");
    } else {
      Serial.print("failed, rc=");
      Serial.print(client.state());
      Serial.println(" try again in 5 seconds");
      delay(5000);
    }
  }
}
void setup() {
  Serial.begin(57600);
  Serial.setTimeout(500);// Set time out for 
  setup_wifi();
  client.setServer(mqtt_server, mqtt_port);
  reconnect();
}

void publishSerialData(char *serialData){
  if (!client.connected()) {
    reconnect();
  }
  client.publish("/rfid", serialData);
}
void loop() {
   client.loop();
   if (Serial.available() > 0) {
     char bfr[101];
     memset(bfr,0, 101);
     Serial.readBytesUntil( '\n',bfr,100);
     publishSerialData(bfr);
   }
 }
