#### 1.2.0 (2021-07-24)

##### Chores

* **👔:**
  * Added generate-changelog tool to the
    project. ([154c9278](https://github.com/AlvaroIsrael/medprev-backend/commit/154c92781c6ef4bacf07127f5fa50863a8b08450))
  * Added dotenv dependency to read process.env
    files. ([6a6cd3d5](https://github.com/AlvaroIsrael/medprev-backend/commit/6a6cd3d5c487d97199a3e89ef7270223467cea07))
  * Added .env.example
    file. ([3e279dda](https://github.com/AlvaroIsrael/medprev-backend/commit/3e279dda52620eba3151850e46f47030c77a46a1))
  * Improvement of .editorconfig file to take into consideration max line of 120
    length. ([5dcdb414](https://github.com/AlvaroIsrael/medprev-backend/commit/5dcdb4145b4b5d7b1d48f3f83cf385327a918474))
  * Implemented endpoint to list all people. + Implemented endpoint to list ope
    person. ([d85953cd](https://github.com/AlvaroIsrael/medprev-backend/commit/d85953cdb46eaefd77d831eae8a4544dbc97a723))
  * Added natural person unit tests. + Fixed typo in natural person entity file name. + Improved sex flag with better
    typing. ([cbfcf66d](https://github.com/AlvaroIsrael/medprev-backend/commit/cbfcf66d191058772dafa5e1e8c9d4f888659360))
  * Removed required validation from address complement field. + Removed required validation from address district
    field. + Fixed document validation logic to accept formatted strings with . and - signs. + Fixed landlinePhoneNumber
    regex validation. + Fixed mobilePhoneNumber regex validation. + Fixed findById function return type. + Fixed
    findByDocument function return type. + Finished unity tests for LegalPerson creation process.
    Closes [#20](https://github.com/AlvaroIsrael/medprev-backend/pull/20)
    . ([5d9193e9](https://github.com/AlvaroIsrael/medprev-backend/commit/5d9193e935ccb25d85d3a44781cb6b210d9e6e12))
  * Fixed document validation message. + Corrected kind and role validation range behavior to allow only valid range
    words. + Fixed worng document names in validation metos for people entities. + Added unity tests for role in
    LegalPerson. + Added unity tests for document in LegalPerson. + Added unity tests for corporateName in
    LegalPerson. ([b65a33ff](https://github.com/AlvaroIsrael/medprev-backend/commit/b65a33ff760b1904f97c332c3471b91faa5bc5de))
  * Updated swagger from 2.0 to openapi
    3.0.0. ([449b183a](https://github.com/AlvaroIsrael/medprev-backend/commit/449b183a7fc5ceaf78e6b1d955933b0e8057429f))

##### Documentation Changes

* **📝:**
  * Fixed img path in README.md
    file. ([f430a46e](https://github.com/AlvaroIsrael/medprev-backend/commit/f430a46e593beb3860eb01706a9f92cffa92c290))
  * Changed app
    title. ([ea846636](https://github.com/AlvaroIsrael/medprev-backend/commit/ea8466367c98dd5ef6c90322a79918150a0f4c29))
  * Added logo to README.md
    file. ([96e59125](https://github.com/AlvaroIsrael/medprev-backend/commit/96e591254a9037a1be134457b3de4b43be42d2f4))
  * Updated README.md file. + Updated swagger.yaml
    version. ([daae8b57](https://github.com/AlvaroIsrael/medprev-backend/commit/daae8b57cb48732e4dbdc25c048d7d3d6963a0ca))

##### New Features

* **👑:**
  * Created a new interface to handle authentication token
    creation. ([2853aef4](https://github.com/AlvaroIsrael/medprev-backend/commit/2853aef4ff7c3abe95d5e79f35d10b123d4db8da))
  * Changed AuthenticateUserService to generate token based in document instead of
    e-mail. ([6d6caa72](https://github.com/AlvaroIsrael/medprev-backend/commit/6d6caa72cef3bb9a9dfaeab5383e9b8096ffcc3a))
  * Improvement of server.ts to take into consideration port number from .env
    file. ([0558e5b7](https://github.com/AlvaroIsrael/medprev-backend/commit/0558e5b7edc0582ce0eac62e64af950fae053560))
  * Added APP_SECRET from env
    file. ([b72987e9](https://github.com/AlvaroIsrael/medprev-backend/commit/b72987e9dfed4e69437c5c6cd484a6ec0e8c986b))
  * Added initial Read logic to list all addresses registered. + Added initial Delete logic to delete an address
    entity. ([975928eb](https://github.com/AlvaroIsrael/medprev-backend/commit/975928eb07a5827a4d96f7922fa564c9cd5034c6))
  * Added initial Update logic to update an Address entity. + Altered all ids to string. + Added create address route
    error treatment. + Added celebrate dependency to the
    project. ([bb49db08](https://github.com/AlvaroIsrael/medprev-backend/commit/bb49db08e4407d0d631ee8f85b3b3a0d75da5005))
  * Added initial Delete logic to delete a Person
    entity. ([1f138a4f](https://github.com/AlvaroIsrael/medprev-backend/commit/1f138a4f6a1cd39007414ca9a0a24299f8eb99bf))
  * Added initial Patch logic to update a Person entity. + Improved README contributing
    section. ([545d71d6](https://github.com/AlvaroIsrael/medprev-backend/commit/545d71d6b3733ef01793c7cdac70ccb6d1177456))
  * Implemented address creation service. + Implemented address creation service unity tests. + Updated 'contributing'
    section in
    README.md. ([0f8c532b](https://github.com/AlvaroIsrael/medprev-backend/commit/0f8c532be4c2593da25524faa98fee8efa173793))
  * Altered CreatePersonService.ts to receive PersonRegistry.ts through dependency injection. + Refactored
    PersonRegistry isolating 'people.get' method to make unity testing possible. + Added unity tests to
    PersonRegistry.ts. ([d4a3681c](https://github.com/AlvaroIsrael/medprev-backend/commit/d4a3681c58c57e7f2e174cfb32548e78658866a3))

##### Tests

* **✅:**
  * Updated unity tests to reflect changes in authentication
    service. ([daa1ba52](https://github.com/AlvaroIsrael/medprev-backend/commit/daa1ba52dec233d8179a21ccfb060831d2d6cde4))
  * Add UpdatePersonService unity tests for natural person
    entity. ([3e521591](https://github.com/AlvaroIsrael/medprev-backend/commit/3e521591c3881d1a10f821c011ef45660db9d961))
  * Add UpdatePersonService unity tests for natural person
    entity. ([813f10ea](https://github.com/AlvaroIsrael/medprev-backend/commit/813f10ea6f92b91bae615153d66bbe991b4ac876))
  * Add UpdatePersonService unity tests for legal person
    entity. ([4ba9153c](https://github.com/AlvaroIsrael/medprev-backend/commit/4ba9153c422fa8f6694002af5fdaf176423ea9a3))
  * Add UpdateAddressService unity
    tests. ([8d77d256](https://github.com/AlvaroIsrael/medprev-backend/commit/8d77d2561cb6eae460d0041f02202543120e46b7))
  * Add ListPersonService unity
    tests. ([5d21e8f7](https://github.com/AlvaroIsrael/medprev-backend/commit/5d21e8f7aa802281d31211c9ca06a82917ec94d3))
  * Add ListPeopleService unity
    tests. ([2ab898c3](https://github.com/AlvaroIsrael/medprev-backend/commit/2ab898c36553acdfbc21864b9931317d8970681e))
  * Add missing async call to some mock implementations. + Improve PersonRegistry unity test by adding missing error
    throwing
    operation. ([10007b6d](https://github.com/AlvaroIsrael/medprev-backend/commit/10007b6d4f0f6acbcf12239ef592c7a6f147eb2e))
  * Add ListAddressService unity
    tests. ([0c367f37](https://github.com/AlvaroIsrael/medprev-backend/commit/0c367f3720f04b7b19b736698ad13a2b6f7fe499))
  * Added AuthenticateUserService unity
    tests. ([756eb414](https://github.com/AlvaroIsrael/medprev-backend/commit/756eb414b6ac5a5e507edf4cfc43968c72404121))
  * Added DeletePersonService unity
    tests. ([55a603c1](https://github.com/AlvaroIsrael/medprev-backend/commit/55a603c182a70302b9ff71675f74fb9ba7022597))
