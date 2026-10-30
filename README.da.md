# SALUS Climate Card – dansk vejledning

Kortet installeres som et **dashboardkort** gennem HACS. Vejr-blueprintet
importeres separat; installation af kortet installerer ikke reglen.

1. HACS → menu → Brugerdefinerede repositories.
2. Tilføj `https://github.com/MichaelBusackBertelsen/salus-room-card` med typen Dashboard.
3. Download kortet; slå betaversioner til for prøveudgaven.
4. Genindlæs browseren helt med Ctrl+F5.
5. Tilføj SALUS Climate Card og vælg rummets climate-entitet.

Korttypen er `custom:salus-climate-card`. Den kan bruges ved siden af det gamle
indbyggede kort. Din nuværende beta og dine eksisterende kort ændres ikke.
Ved flytning af et kort ændres kun typen; behold entitets-id'er og layout.

Gulvkomfort-select er valgfri. Uden den kan temperatur og historik fortsat bruges.
Dansk vælges automatisk, når Home Assistants sprog er dansk; standarden er engelsk.

Alle komforttider og begrundelser vises kun på det udfoldede kort. Til det nye
blueprint vælges rummets input_text-statushjælper og den fælles automation i
editoren. Kortet læser hjælperne og ændrer dem ikke. Aktivitet-knappen åbner
rummets Gulvkomfort-entitet. Hentet historik følger Recorder-opbevaring og filtre.

Se [vejr-blueprintet](https://github.com/MichaelBusackBertelsen/salus-comfort-blueprint)
for fælles automation og separate timere/status pr. rum.
