// import AuthContext from '@/components/Auth/AuthContext';
// import { Layout } from '@/components/Layout/Layout'
// import { Box, Flex, Text, Title } from '@mantine/core'
// import { IconAlertOctagon } from '@tabler/icons';
// import { useContext, useState } from 'react';

// const KYC = () => {
//     const { kycVerified } = useContext(AuthContext);

//     return (
//         <Layout
//             pageTitle='KYC'
//         >
//             <Flex
//                 mt={50}
//                 direction='column'
//                 align='center'
//                 w='100%'
//             >
//                 <Title
//                     size={56}
//                     sx={(theme) => ({
//                         color: '#42ca9f',
//                         lineHeight: 1,
//                         [theme.fn.smallerThan('md')]: {
//                             fontSize: 40
//                         }
//                     })}
//                 >
//                     KYC VERIFICATION
//                 </Title>
//                 {kycVerified ? (
//                     <Box
//                         sx={(theme) => ({
//                             margin: '20px 30px 35px 0px',
//                             padding: '10px 20px',
//                             borderRadius: theme.radius.md,
//                             width: '60%',
//                             textAlign: 'center',
//                             borderBottom: '2px solid #42ca9f',
//                             borderRight: '2px solid #42ca9f',
//                             borderTop: '2px solid #42ca9f',
//                             borderLeft: '2px solid #42ca9f',

//                             [theme.fn.smallerThan('md')]: {
//                                 margin: '20px 0px 35px 0px',
//                                 width: '100%',
//                             }
//                         })}
//                     >
//                         <Flex
//                             direction='row'
//                             align='center'
//                             justify='center'
//                         >
//                             <IconAlertOctagon color='#42ca9f' size={45} style={{marginRight: 35}} />
//                             <Text sx={(theme) => ({
//                                 color: '#42ca9f',
//                                 fontSize: '20px',
//                                 [theme.fn.smallerThan('sm')]: {
//                                     fontSize: '14px'
//                                 }
//                             })}>
//                                 <b>You have successfully completed your KYC verification. <br /> No further action is needed for now.</b>
//                             </Text>
//                         </Flex>
//                     </Box>
//                 ) : (
//                     <p>KYC Verification Portal is not developed yet.</p>
//                 )}
//             </Flex>
//         </Layout>
//     )
// }

// export default KYC