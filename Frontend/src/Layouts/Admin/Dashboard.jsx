import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Dashboard = () => {
	return (

		<div>


			<div class="container-fluid">

				<div class="row">
					<div class="col-xl-12">
						<div className="row main-card">
							<Swiper
								spaceBetween={30}
								slidesPerView={1}
								onSlideChange={() => console.log('slide change')}
								onSwiper={(swiper) => console.log(swiper)}
							>
								<SwiperSlide>
									<div className="card card-box bg-secondary">
										<div className="card-header border-0 pb-0">
											<div className="chart-num">
												<p>
													<i className="fa-solid fa-sort-down me-2" />
													4%(30 days)
												</p>
												<h2 className="font-w600 mb-0">$65,123</h2>
											</div>
											<div className="dlab-swiper-circle"></div>
										</div>
										<div className="card-body p-0">
											<div id="widgetChart1" className="chart-primary">
												<div
													options="[object Object]"
													series="[object Object]"
													type="line"
													height={70}
													width={500}
													style={{ minHeight: 70 }}
												>
													<div
														id="apexchartsx9yes9xy"
														className="apexcharts-canvas apexchartsx9yes9xy apexcharts-theme-light"
														style={{ width: 500, height: 70 }}
													></div>
												</div>
											</div>
										</div>
									</div>
								</SwiperSlide>
								{/* Add more SwiperSlide components as needed */}
							</Swiper>
						</div>

						<div class="row">
							<div class="col-xl-6">
								<div class="card crypto-chart">
									<div class="card-header pb-0 border-0 flex-wrap">
										<div class="mb-0">
											<h4 class="card-title">Crypto Statistics</h4>
											<p>Lorem ipsum dolor sit amet, consectetur</p>
										</div>
										<div class="d-flex mb-2">
											<div class="form-check form-switch toggle-switch me-3">
												<label class="form-check-label" for="flexSwitchCheckChecked1">Date</label>
												<input class="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked1" checked="" />
											</div>
											<div class="form-check form-switch toggle-switch">
												<label class="form-check-label" for="flexSwitchCheckChecked2">Value</label>
												<input class="form-check-input custome" type="checkbox" id="flexSwitchCheckChecked2" checked="" />
											</div>
										</div>
									</div>
									<div class="card-body pt-2">
										<ul class="nav nav-pills" role="tablist">
											<li class=" nav-item" role="presentation">
												<a href="#navpills-1" class="nav-link active" data-bs-toggle="tab" aria-expanded="false" aria-selected="true" role="tab">Ripple</a>
											</li>
											<li class="nav-item" role="presentation">
												<a href="#navpills-2" class="nav-link " data-bs-toggle="tab" aria-expanded="false" aria-selected="false" tabindex="-1" role="tab">Bitcoin</a>
											</li>
											<li class="nav-item" role="presentation">
												<a href="#navpills-3" class="nav-link" data-bs-toggle="tab" aria-expanded="true" aria-selected="false" tabindex="-1" role="tab">Ethereum</a>
											</li>
											<li class="nav-item" role="presentation">
												<a href="#navpills-5" class="nav-link" data-bs-toggle="tab" aria-expanded="true" aria-selected="false" tabindex="-1" role="tab">Zcash</a>
											</li>
											<li class="nav-item" role="presentation">
												<a href="#navpills-5" class="nav-link" data-bs-toggle="tab" aria-expanded="true" aria-selected="false" tabindex="-1" role="tab">LiteCoin</a>
											</li>
										</ul>

									</div>
								</div>
							</div>
							<div class="col-lg-12">
								<div class="card transaction-table">
									<div class="card-header border-0 flex-wrap pb-0">
										<div class="mb-2">
											<h4 class="card-title">Recent Transactions</h4>
											<p class="mb-sm-3 mb-0">Lorem ipsum dolor sit amet, consectetur</p>
										</div>
										<ul class="float-end nav nav-pills mb-2" role="tablist">
											<li class="nav-item" role="presentation">
												<button class="nav-link active" id="Week-tab" data-bs-toggle="tab" data-bs-target="#Week" type="button" role="tab" aria-controls="month" aria-selected="true">Week</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="month-tab" data-bs-toggle="tab" data-bs-target="#month" type="button" role="tab" aria-controls="month" aria-selected="false" tabindex="-1">Month</button>
											</li>
											<li class="nav-item" role="presentation">
												<button class="nav-link" id="year-tab" data-bs-toggle="tab" data-bs-target="#year" type="button" role="tab" aria-controls="year" aria-selected="false" tabindex="-1">Year</button>
											</li>
										</ul>
									</div>
									<div class="card-body p-0">
										<div class="tab-content" id="myTabContent1">
											<div class="tab-pane fade show active" id="Week" role="tabpanel" aria-labelledby="Week-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-success font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-success font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class="me-2" width="30" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td class="text-danger font-w600">+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
											<div class="tab-pane fade show" id="month" role="tabpanel" aria-labelledby="month-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no" >Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																		<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																			<polygon points="0 0 24 0 24 24 0 24"></polygon>
																			<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																			<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																		</g>
																	</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
											<div class="tab-pane fade show" id="year" role="tabpanel" aria-labelledby="year-tab">
												<div class="table-responsive">
													<table class="table table-responsive-md">
														<thead>
															<tr>
																<th>
																	#
																</th>
																<th>Transaction ID</th>
																<th>Date</th>
																<th>From</th>
																<th>To</th>
																<th>Coin</th>
																<th>Amount</th>
																<th class="text-end">Status</th>
															</tr>
														</thead>
														<tbody>
															<tr>
																<td>
																	{/* <svg class="arrow svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/1.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-success">COMPLETED</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-1 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/2.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-warning">PENDING</div></td>
															</tr>
															<tr>
																<td>
																	{/* <svg class="arrow style-2 svg-main-icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="24px" height="24px" viewBox="0 0 24 24" version="1.1">
																			<g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
																				<polygon points="0 0 24 0 24 24 0 24"></polygon>
																				<rect fill="#fff" opacity="0.3" transform="translate(11.646447, 12.853553) rotate(-315.000000) translate(-11.646447, -12.853553) " x="10.6464466" y="5.85355339" width="2" height="14" rx="1"></rect>
																				<path d="M8.1109127,8.90380592 C7.55862795,8.90380592 7.1109127,8.45609067 7.1109127,7.90380592 C7.1109127,7.35152117 7.55862795,6.90380592 8.1109127,6.90380592 L16.5961941,6.90380592 C17.1315855,6.90380592 17.5719943,7.32548256 17.5952502,7.8603687 L17.9488036,15.9920967 C17.9727933,16.5438602 17.5449482,17.0106003 16.9931847,17.0345901 C16.4414212,17.0585798 15.974681,16.6307346 15.9506913,16.0789711 L15.6387276,8.90380592 L8.1109127,8.90380592 Z" fill="#fff" fill-rule="nonzero"></path>
																			</g>
																		</svg> */}
																</td>
																<td>#12415346563475</td>
																<td>01 August 2020</td>
																<td>Thomas</td>
																<td><div class="d-flex align-items-center"><img src="images/avatar/3.jpg" class=" me-2" width="24" alt="" /> <span class="w-space-no">Dr. Jackson</span></div></td>
																<td><div class="d-flex align-items-center"><img src="images/svg/btc.svg" alt="" class="me-2 img-btc" />Bitcoin</div></td>
																<td>+$5,553</td>
																<td class="text-end"><div class="badge badge-sm badge-danger">CANCEL</div></td>
															</tr>
														</tbody>
													</table>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>

		</div>

	);
}

export default Dashboard;

