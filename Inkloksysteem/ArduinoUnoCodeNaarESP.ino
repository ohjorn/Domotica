#include <SoftwareSerial.h>
#include <MFRC522.h>

#define SS_PIN 10
#define RST_PIN 9

MFRC522 mfrc522(SS_PIN, RST_PIN);
SoftwareSerial sw(2, 3);

void setup() {
 Serial.begin(115200);
 Serial.println("Arduino verbinden met ESP8266.");
 sw.begin(115200);
 SPI.begin();      // Initiate  SPI bus
 mfrc522.PCD_Init();   // Initiate MFRC
 Serial.println("Kaart bij reader houden...");
 Serial.println();
 
}

void loop() {
 // Zoeken naar kaart
  if ( ! mfrc522.PICC_IsNewCardPresent()) 
  {
    return;
  }
  // Select one of the cards
  if ( ! mfrc522.PICC_ReadCardSerial()) 
  {
    return;
  }
  // UID op serial monitor displayen
  Serial.print("UID tag :");
  String content= "";
  byte letter;
  for (byte i = 0; i < mfrc522.uid.size; i++) 
  {
     Serial.print(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " ");
     Serial.print(mfrc522.uid.uidByte[i], HEX);
     content.concat(String(mfrc522.uid.uidByte[i] < 0x10 ? " 0" : " "));
     content.concat(String(mfrc522.uid.uidByte[i], HEX));
  }
   Serial.println();
   content.toUpperCase();
   Serial.print("Message : ");
   Serial.print(content);//offset
   Serial.println();
   sw.print(content);
   sw.println();
   delay(5000);
}
