#include <SoftwareSerial.h>

int temperatuurPin = 0; 
SoftwareSerial sw(2, 3); // RX, TX



void setup() {
 Serial.begin(115200);
 Serial.println("Interfacing arduino with ESP8266-01");
 sw.begin(115200);
 Serial.println();
 
}


void loop() {
  
  int reading = analogRead(temperatuurPin);
  float voltage = reading * 5.0;
  voltage /= 1024.0;
  float temperatuur = (voltage - 0.5) * 100;
  Serial.print(temperatuur);
  Serial.println(" °C");
  Serial.println();
  sw.print(temperatuur);
  sw.println();
  delay(5000);
}
