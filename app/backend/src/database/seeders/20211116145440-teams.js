module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert(
      'teams',
      [
        {
          teamName: 'Avaí/Kindermann',
        },
        {
          teamName: 'Bahia',
        },
        {
          teamName: 'Botafogo',
        },
        {
          teamName: 'Corinthians',
        },
        {
          teamName: 'Cruzeiro',
        },
        {
          teamName: 'Ferroviária',
        },
        {
          teamName: 'Flamengo',
        },
        {
          teamName: 'Grêmio',
        },
        {
          teamName: 'Internacional',
        },
        {
          teamName: 'Minas Brasília',
        },
        {
          teamName: 'Napoli-SC',
        },
        {
          teamName: 'Palmeiras',
        },
        {
          teamName: 'Real Brasília',
        },
        {
          teamName: 'Santos',
        },
        {
          teamName: 'São José-SP',
        },
        {
          teamName: 'São Paulo',
        },
      ],
      {},
    );
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('teams', null, {});
  },
};
